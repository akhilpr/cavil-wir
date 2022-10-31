import { Component, OnInit } from '@angular/core';
import { zoneDeatailsI } from './interface/dashboardInterface';
import * as XLSX from 'xlsx';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  zone = '';
  price = '';
  operator = '';
  zoneData: Array<zoneDeatailsI> = [];
  data = [[], []];
  xlData: any = [];
  wopts: XLSX.WritingOptions = { bookType: 'xlsx', type: 'array' };
  fileName: string = 'SheetJS.xlsx';
  tarifForm = this.fb.group({
    tariff: this.fb.array([])
  })
  constructor(private fb: FormBuilder, private _snackBar: MatSnackBar, private router: Router) {
  }

  get tarifFieldAsFormArray() {
    return (this.tarifForm.controls['tariff'] as FormArray);
  }

  ngOnInit(): void {
  }

  uploadTarrif(arg: any) {
    this.tarifFieldAsFormArray.push(this.fb.group({
      ...arg
    }))
  }

  createItemTarrif(): FormGroup {
    return this.fb.group({
      zone: [''],
      country: [''],
      network_operator: [''],
      network_code: [''],
      increment_type: [''],
    });
  }

  addZone() { // add zone data
    if (this.zone === '' || this.price === '') { // return fileds are empty
      return
    }

    if (this.zoneValidation()) {
      this.zoneData.push({ zone_name: this.zone, zone_price: this.price })
      this.zone = '';
      this.price = '';
    }
  }
  deleteZone(item: string) { // remove zone
    this.zoneData = this.zoneData.filter(res => res.zone_name !== item)
  }
  zoneValidation() { // validate zone before updating
    if (!this.zoneData.filter(res => res.zone_name === this.zone).length) {
      return true
    } else {
      return false
    }
  }


  onFileChange(evt: any) {
    /* wire up file reader */
    const target: DataTransfer = <DataTransfer>(evt.target);
    if (target.files.length !== 1) throw new Error('Cannot use multiple files');
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      /* read workbook */
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

      /* grab first sheet */
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      /* save data */
      this.data = (XLSX.utils.sheet_to_json(ws, { header: 1 }));
      if (this.data[1].length === 0) {
        this.openSnackBar('Upload Valid File')
        return
      }
      this.data.map((res, ind) => {
        if (ind !== 0) {
          const data = {
            zone: res[0],
            country: res[1],
            network_operator: res[2],
            network_code: res[3],
            increment_type: res[4],
          }
          this.uploadTarrif(data);
        }
      })
    };
    reader.readAsBinaryString(target.files[0]);
  }

  addTarifZone() { // adds new tarif line
    this.tarifFieldAsFormArray.push(this.createItemTarrif())
  }

  removeTariff(ind: number) { // adds new tarif line
    this.tarifFieldAsFormArray.removeAt(ind);
  }

  zoneCheck(item: any) {// valdates zone
    if (this.zoneData.findIndex(res => res.zone_name ===
      item.controls.zone.value) === -1 && item.controls.zone.value !== '') {
      return true
    } else { return false; }

  }

  networkCheck(item: any) { // valdates Network_code should be unique
    if (this.tarifForm.controls.tariff.value.filter((res: any) =>
      res.network_code === item.controls.network_code.value).length > 1
      && item.controls.network_code.value !== '') {
      return true
    } else { return false; }

  }
  submit() {
    const finalData = {
      network_operator: this.operator,
      zone_details: this.zoneData,
      ...this.tarifForm.value,
    }
    console.log(finalData);
  }
  cancel() {
    if (confirm("uploaded content in the table and file should be cleared!")) {
      this.clearAll()
    }
  }
  clearAll() {
    this.operator = ''
    this.zone = ''
    this.price = ''
    this.zoneData = []
    this.tarifForm.controls.tariff.value.forEach((_, ind) => {
      this.tarifFieldAsFormArray.removeAt(ind);
    })
  }

  logout() {
    localStorage.clear()
    this.router.navigate(['/']);
  }

  openSnackBar(msg: string) {
    this._snackBar.open(msg, 'Ok', {
      duration: 5 * 1000,
    });
  }
}
