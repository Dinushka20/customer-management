package com.example.customer_management.controller;

import com.example.customer_management.service.ExcelService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/customers/bulk")
@RequiredArgsConstructor
public class BulkUploadController {

    private final ExcelService excelService;

    /**
     * POST /api/customers/bulk
     * Accepts a multipart .xlsx file.
     * Returns a summary: totalProcessed, created, updated, errors.
     */
    @PostMapping
    public ResponseEntity<Map<String, Object>> bulkUpload(
            @RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        String filename = file.getOriginalFilename();
        if (filename == null || !filename.endsWith(".xlsx")) {
            Map<String, Object> err = new HashMap<>();
            err.put("error", "Only .xlsx files are supported");
            return ResponseEntity.badRequest().body(err);
        }
        try {
            Map<String, Object> result = excelService.processBulkUpload(file);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            Map<String, Object> err = new HashMap<>();
            err.put("error", e.getMessage());
            return ResponseEntity.internalServerError().body(err);
        }
    }
}