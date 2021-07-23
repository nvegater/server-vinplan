const Excel = require('exceljs');

interface buildExcelAsBuffer {
    creator: string;
    report:string;
    data:any
}

const getColumns = (obj: any) => Object.keys(obj).map((key) => ({header: key, key}));

export async function buildExcelAsBuffer (excelInfo : buildExcelAsBuffer) {

    console.log('desde el excelUtilities', excelInfo);

    const workbook = new Excel.Workbook();
        workbook.creator = excelInfo.creator;

        const reportSheet = workbook.addWorksheet(excelInfo.report);

        const responseObject = excelInfo.data;

        reportSheet.columns = getColumns(responseObject[0]);
        reportSheet.addRows(responseObject);

        return await workbook.xlsx.writeBuffer();
}