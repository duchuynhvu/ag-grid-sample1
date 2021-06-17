import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  gridApi: any;
  gridColumnApi: any;
  rowData: any;

  //Cài đặt column definition
  columnDefs = [
    { headerName: 'Athlete', field: 'athlete'},
    { headerName: 'Sport', field: 'sport' },
    { headerName: 'Age', field: 'age', type: 'numberColumn' },
    { headerName: 'Year', field: 'year', type: 'numberColumn' },
    { headerName: 'Date', field: 'date', type: ['dateColumn', 'nonEditableColumn'], width: 220 },
    { headerName: 'Medals', groupId: 'medalsGroup',
      children: [
        { headerName: 'Gold', field: 'gold', type: 'medalColumn' },
        { headerName: 'Silver', field: 'silver', type: 'medalColumn' },
        { headerName: 'Bronze', field: 'bronze', type: 'medalColumn' },
        { headerName: 'Total', field: 'total', type: 'medalColumn', columnGroupShow: 'closed' },
      ],
    },
  ];

  //Cài đặt column definition mặc định
  defaultColDef = {
    width: 150,
    editable: true,
    filter: 'agTextColumnFilter',
    floatingFilter: true,
    resizable: true,
  };

  defaultColGroupDef= { marryChildren: true };

  //Cài đặt column type
  columnTypes = {
    numberColumn: {
      width: 130,
      filter: 'agNumberColumnFilter',
    },
    medalColumn: {
      width: 100,
      columnGroupShow: 'open',
      filter: false,
    },
    nonEditableColumn: { editable: false },
    dateColumn: {
      filter: 'agDateColumnFilter',
      filterParams: {
        comparator: function (
          filterLocalDateAtMidnight: any,
          cellValue: string
        ) {
          var dateParts = cellValue.split('/');
          var day = Number(dateParts[0]);
          var month = Number(dateParts[1]) - 1;
          var year = Number(dateParts[2]);
          var cellDate = new Date(year, month, day);
          if (cellDate < filterLocalDateAtMidnight) {
            return -1;
          } else if (cellDate > filterLocalDateAtMidnight) {
            return 1;
          } else {
            return 0;
          }
        },
      },
    },
  };

  constructor(private http: HttpClient) { }

  onGridReady(params: any) {
    //Khởi tạo các object cho phép truy cập tới grid và column grid
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;

     //Tải dữ liệu từ remote server cho ag-grid hiển thị
    this.http
      .get('https://www.ag-grid.com/example-assets/olympic-winners.json')
      .subscribe((data) => {
        this.rowData = data;
      });
  }
}
