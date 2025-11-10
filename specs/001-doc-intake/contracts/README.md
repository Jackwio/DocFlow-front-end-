# API Integration Contracts

This directory contains TypeScript implementations of the Documents API client based on `documents-api.md`.

## Files

- `documents-api.ts` - TypeScript types and interfaces matching API schema
- `api-client.ts` - Axios-based HTTP client with interceptors and endpoints
- `README.md` - This file

## Usage

These contracts will be used to generate the actual API client in `src/services/api/`.

The types defined here provide compile-time safety and runtime validation (via Zod) for all API interactions.
