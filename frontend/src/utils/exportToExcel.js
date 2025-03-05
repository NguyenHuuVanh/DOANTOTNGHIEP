import * as XLSX from "xlsx";
import {saveAs} from "file-saver";

/**
 * Hàm xuất dữ liệu JSON thành file Excel
 * @param {Array} data - Dữ liệu cần export (mảng JSON)
 * @param {string} fileName - Tên file Excel (mặc định: UsersData.xlsx)
 */
export const exportToExcel = (data, fileName = "UsersData.xlsx") => {
  try {
    // Tạo worksheet từ dữ liệu JSON
    const worksheet = XLSX.utils.json_to_sheet(data);
    // Tạo workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    // Chuyển workbook thành buffer
    const excelBuffer = XLSX.write(workbook, {bookType: "xlsx", type: "array"});
    // Tạo Blob từ buffer và lưu file
    const dataBlob = new Blob([excelBuffer], {type: "application/octet-stream"});
    saveAs(dataBlob, fileName);
  } catch (error) {
    console.error("Error exporting to Excel:", error);
  }
};
