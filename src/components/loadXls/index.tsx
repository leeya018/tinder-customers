import React, { ChangeEvent, useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import * as XLSX from "xlsx";

type LoadXlsProps = {
  callback: (json: Object) => void;
};

const LoadXls = observer<LoadXlsProps>(({ callback }) => {
  const [data, setData] = useState<any>([]);

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    try {
      if (!e.target.files || !e.target.files[0])
        throw new Error("File is null");

      const file = e.target.files[0];

      const reader = new FileReader();
      reader.onload = (event: any) => {
        const binaryString = event.target.result;
        const workbook = XLSX.read(binaryString, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
        setData(jsonData);
        console.log({ jsonData });
        callback(jsonData);
      };
      reader.readAsBinaryString(file);
    } catch (error: any) {
      console.log(error.stack);
    }
  };

  return (
    <div className="flex flex-col items-center p-6 border border-gray-300 rounded-lg shadow-lg bg-white max-w-md mx-auto">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">
        Upload XLS File
      </h2>
      <input
        className="file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold
                   file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        type="file"
        onChange={handleFileUpload}
        accept=".xlsx, .xls"
      />
      {data.length > 0 && (
        <div className="mt-6 w-full max-h-40 overflow-y-auto bg-gray-50 p-4 rounded-lg shadow-inner">
          <p className="text-sm font-medium text-gray-600">
            File loaded successfully
          </p>
          <ul className="text-xs text-gray-500 mt-2 space-y-1">
            {data.slice(0, 5).map((row: any, index: number) => (
              <li key={index}>{JSON.stringify(row)}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
});

export default LoadXls;
