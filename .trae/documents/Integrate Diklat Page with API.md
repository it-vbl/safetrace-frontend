I will perform the following steps to integrate the Diklat page with the API:

1.  **Update `src/services/petani.js`**:
    *   Add the following API service functions:
        *   `getListDiklat(params)`: GET `/petani/diklat/list/`
        *   `getStatistikDiklat()`: GET `/petani/diklat/statistik/`
        *   `updateDiklat(id, payload)`: POST `/petani/diklat/update/${id}/`
        *   `getDetailDiklat(id)`: GET `/petani/diklat/detail/${id}/`
        *   `downloadListDiklat(params)`: GET `/petani/diklat/list/download/` (for Excel/CSV export)

2.  **Refactor `src/app/traceability/diklat/page.jsx`**:
    *   **Imports**: Import the new service functions.
    *   **State Management**:
        *   Update `diklatData` state to store the list from the API.
        *   Update `statistik` state to store data from `getStatistikDiklat`.
    *   **Data Fetching**:
        *   Implement `fetchDiklatData` to call `getListDiklat` with pagination and filters (`search`, `kelompok`).
        *   Implement `fetchStatistik` to call `getStatistikDiklat` and populate the statistic cards.
        *   Use `useEffect` to trigger these fetches on mount and when filters change.
    *   **Form Integration (Update Modal)**:
        *   Fix the `useFormik` configuration:
            *   Change `initialValues` to match the Diklat fields: `sl`, `pnc`, `pestisida`, `k3`, `sop`, `pdg`.
            *   Update `validationSchema` (if needed) or remove unrelated validations.
            *   Implement `onSubmit` to call `updateDiklat` with the form values.
        *   Fix the `Select` components in the modal:
            *   Bind each `Select` to the corresponding Formik field (`value` and `onChange`).
            *   Update `statusOption` to use boolean values (`true`/`false`) instead of strings, to match the API.
    *   **Export Feature**:
        *   Implement `handleExportExcel` to use `downloadListDiklat` and save the response as a `.csv` file (consistent with the previous fix).
    *   **Column Definitions**:
        *   Ensure column definitions map correctly to the API response fields.

3.  **Verification**:
    *   I will verify the code structure and ensure all imports and variable references are correct.
