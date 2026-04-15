import { test, expect } from '@playwright/test';
import ExcelJs from 'exceljs';

async function writeExcelTest(
  searchText: string,
  replaceText: string | number,
  change: { rowChange: number; colChange: number },
  filePath: string
) {
  const workbook = new ExcelJs.Workbook();
  await workbook.xlsx.readFile(filePath);
  const worksheet = workbook.getWorksheet('Sheet1')!;
  const output = await readExcel(worksheet, searchText);

  const cell = worksheet.getCell(output.row, output.column + change.colChange);
  cell.value = replaceText;
  await workbook.xlsx.writeFile(filePath);
}

async function readExcel(
  worksheet: ExcelJs.Worksheet,
  searchText: string
): Promise<{ row: number; column: number }> {
  const output = { row: -1, column: -1 };
  worksheet.eachRow((row, rowNumber) => {
    row.eachCell((cell, colNumber) => {
      if (cell.value === searchText) {
        output.row = rowNumber;
        output.column = colNumber;
      }
    });
  });
  return output;
}

test('Upload download excel validation', async ({ page }) => {
  const textSearch = 'Mango';
  const updateValue = '350';
  await page.goto('https://rahulshettyacademy.com/upload-download-test/index.html');
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download' }).click();
  await downloadPromise;
  writeExcelTest(textSearch, updateValue, { rowChange: 0, colChange: 2 }, '/Users/rahulshetty/downloads/download.xlsx');
  await page.locator('#fileinput').click();
  await page.locator('#fileinput').setInputFiles('/Users/rahulshetty/downloads/download.xlsx');
  const textlocator = page.getByText(textSearch);
  const desiredRow = page.getByRole('row').filter({ has: textlocator });
  await expect(desiredRow.locator('#cell-4-undefined')).toContainText(updateValue);
});
