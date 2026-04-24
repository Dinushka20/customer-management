package com.example.customer_management.service;

import com.example.customer_management.entity.Customer;
import com.example.customer_management.repository.CustomerRepository;
import lombok.RequiredArgsConstructor;
import org.apache.poi.xssf.eventusermodel.XSSFSheetXMLHandler;
import org.apache.poi.xssf.eventusermodel.XSSFReader;
import org.apache.poi.xssf.eventusermodel.ReadOnlySharedStringsTable;
import org.apache.poi.xssf.model.StylesTable;
import org.apache.poi.openxml4j.opc.OPCPackage;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.xml.sax.InputSource;
import org.xml.sax.XMLReader;
import org.xml.sax.helpers.XMLReaderFactory;

import java.io.InputStream;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Handles bulk customer creation/update from an Excel (.xlsx) file.
 *
 * Uses Apache POI SAX-based Event API so even a 1,000,000-row file is
 * streamed row-by-row without loading the whole sheet into memory.
 *
 * Expected Excel columns (row 1 = header, skipped):
 *   A: Name          (mandatory)
 *   B: Date of Birth  yyyy-MM-dd  (mandatory)
 *   C: NIC Number    (mandatory)
 */
@Service
@RequiredArgsConstructor
public class ExcelService {

    private final CustomerRepository customerRepository;

    private static final int BATCH_SIZE = 500;
    private static final DateTimeFormatter DOB_FMT = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    @Transactional
    public Map<String, Object> processBulkUpload(MultipartFile file) throws Exception {

        List<Customer> batch  = new ArrayList<>(BATCH_SIZE);
        List<String>   errors = new ArrayList<>();
        int[]          counts = {0, 0, 0}; // [totalProcessed, created, updated]

        try (InputStream is = file.getInputStream();
             OPCPackage  pkg = OPCPackage.open(is)) {

            XSSFReader               reader = new XSSFReader(pkg);
            ReadOnlySharedStringsTable sst  = new ReadOnlySharedStringsTable(pkg);
            StylesTable              styles = reader.getStylesTable();

            SheetHandler handler = new SheetHandler(
                    batch, errors, counts, customerRepository, BATCH_SIZE);

            XSSFSheetXMLHandler sheetHandler =
                    new XSSFSheetXMLHandler(styles, null, sst, handler, new org.apache.poi.ss.usermodel.DataFormatter(), false);

            XMLReader parser = XMLReaderFactory.createXMLReader();
            parser.setContentHandler(sheetHandler);

            XSSFReader.SheetIterator sheets =
                    (XSSFReader.SheetIterator) reader.getSheetsData();

            if (sheets.hasNext()) {
                try (InputStream sheetStream = sheets.next()) {
                    parser.parse(new InputSource(sheetStream));
                }
            }

            if (!batch.isEmpty()) {
                flushBatch(batch, customerRepository);
            }
        }

        Map<String, Object> result = new HashMap<>();
        result.put("totalProcessed", counts[0]);
        result.put("created",        counts[1]);
        result.put("updated",        counts[2]);
        result.put("errors",         errors.subList(0, Math.min(errors.size(), 100)));
        return result;
    }

    static void flushBatch(List<Customer> batch, CustomerRepository repo) {
        repo.saveAll(batch);
        batch.clear();
    }

    // ── Inner SAX handler ────────────────────────────────────────────────────

    static class SheetHandler implements XSSFSheetXMLHandler.SheetContentsHandler {

        private final List<Customer>     batch;
        private final List<String>       errors;
        private final int[]              counts;
        private final CustomerRepository repo;
        private final int                batchSize;

        private String[] currentRow;

        SheetHandler(List<Customer> batch, List<String> errors,
                     int[] counts, CustomerRepository repo, int batchSize) {
            this.batch     = batch;
            this.errors    = errors;
            this.counts    = counts;
            this.repo      = repo;
            this.batchSize = batchSize;
        }

        @Override
        public void startRow(int rowNum) {
            currentRow = new String[3];
        }

        @Override
        public void endRow(int rowNum) {
            if (rowNum == 0) return; // skip header row

            String name = currentRow[0];
            String dob  = currentRow[1];
            String nic  = currentRow[2];

            if (name == null || name.trim().isEmpty()
                    || dob == null || dob.trim().isEmpty()
                    || nic == null || nic.trim().isEmpty()) {
                errors.add("Row " + (rowNum + 1) + ": missing mandatory field(s)");
                return;
            }

            try {
                LocalDate dateOfBirth = LocalDate.parse(dob.trim(), DOB_FMT);

                Customer customer = repo.findByNicNumber(nic.trim())
                        .orElse(new Customer());

                boolean isNew = (customer.getId() == null);
                customer.setName(name.trim());
                customer.setDateOfBirth(dateOfBirth);
                customer.setNicNumber(nic.trim());

                batch.add(customer);
                counts[0]++;
                if (isNew) { counts[1]++; } else { counts[2]++; }

                if (batch.size() >= batchSize) {
                    flushBatch(batch, repo);
                }

            } catch (Exception e) {
                errors.add("Row " + (rowNum + 1) + ": " + e.getMessage());
            }
        }

        // POI 5.x correct signature — no Comment parameter
        @Override
        public void cell(String cellReference, String formattedValue,
                         org.apache.poi.xssf.usermodel.XSSFComment comment) {
            if (cellReference == null || formattedValue == null) return;
            int col = cellReference.charAt(0) - 'A'; // A=0, B=1, C=2
            if (col >= 0 && col < 3) {
                currentRow[col] = formattedValue;
            }
        }
    }
}