import * as XLSX from "xlsx"

// Make XLSX available globally for the inventory management component
if (typeof window !== "undefined") {
  window.XLSX = XLSX
}

export default XLSX
