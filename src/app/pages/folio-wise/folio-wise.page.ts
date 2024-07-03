import { Component, OnInit } from '@angular/core';
import { FolioWiseService } from './folio-wise.service';
import { saveAs } from 'file-saver';
import { Workbook } from 'exceljs';
import { CommonService } from '../../helpers/common.service';
import { ToasterService } from '../../helpers/toaster.service';
import { StorageServiceAAA } from '../../helpers/aaa-storage.service';

@Component({
	selector: 'app-folio-wise',
	providers: [FolioWiseService],
	templateUrl: './folio-wise.page.html',
	styleUrls: ['./folio-wise.page.scss'],
})
export class FolioWisePage implements OnInit {
	visible: boolean = false;
	folioList: any = [];
	AllClients: any = [];
	tableLoader = true;
	isDiv: boolean = false;
	showID: any;
	filterBy = '';
	constructor(private folioWiseService: FolioWiseService, private commonService: CommonService, private toast: ToasterService, private storage: StorageServiceAAA) {
	}
	ngOnInit() {
		this.getToken();
	}

	/**
	 * To get token
	 */
	getToken() {
		this.storage.get('userType').then(type => {
			if (type === 'RM' || type === 'FAN') {
				this.storage.get('bToken').then(token => {
					this.getFoliowiseData(token);
				})
			} else {
				this.storage.get('subToken').then(token => {
					this.getFoliowiseData(token);
				})
			}
		})
	}

	/**
	 * To get folio wise client detail list.
	 * @param token 
	 */
	getFoliowiseData(token: any) {
		let submission = {
			Partnercode: localStorage.getItem('userId1'),
			PageNo: "0",
			SearchBy: "",
			SearchText: "",
			Fileterby: this.filterBy
		};
		this.folioWiseService.FolioWiseClientDetails(token, submission)
			.subscribe((res: any) => {
				if (res && res.Body) {
					this.folioList = this.folioList = res.Body.filter((ele: any) => ele.partnercode === localStorage.getItem("userId1"))
					.map((ele: any) => {
						let ob = {
							clientCode: ele.clientcode,
							clientName: ele.clientname,
							clientPan: ele.clientpan,
							fNumber: ele.folionumber,
							iiflemail: ele.iiflemail,
							iiflmobileno: ele.iiflmobileno,
							partnerCode: ele.partnercode,
							reason: ele.reason,
							rtaemail: ele.rtaemail.toLowerCase(),							
							rtamobileno: ele.rtamobileno,
							schemeName: ele.schemename,
							showMobPopup: false,
							showMobPopup1: false,
							showEmlPopup: false,
							showEmlPopup1: false,
						}
						return ob;
					});
					this.AllClients = this.folioList;
				}
				else {
					this.folioList = [];
					this.AllClients = this.folioList;
				}
				this.tableLoader = false;
			});
	}

	/**
	 * On click of back arrow.
	 */
	goBack() {
		window.history.back();
	}

	// To show mobile mismatch popup/tooltip.
	showMob(item: any) {
		item.showMobPopup = true;
	}

	// To hide mobile mismatch popup/tooltip.
	hideMob(item: any) {
		item.showMobPopup = false;
	}
	// To show mobile mismatch popup/tooltip.
	showMob1(item: any) {
	item.showMobPopup1 = true;
	}
	// To hide mobile mismatch popup/tooltip.
	hideMob1(item: any) {
	item.showMobPopup1 = false;
	}
	// To show email mismatch popup/tooltip.
	showPopUp(item: any) {
		item.showEmlPopup = true;
	}

	// To hide email mismatch popup/tooltip.
	hidePopup(item: any) {
		item.showEmlPopup = false;
	}
	// To show email mismatch popup/tooltip.
	showPopUp1(item: any) {
		item.showEmlPopup1 = true;
	}
	// To hide email mismatch popup/tooltip.
	hidePopup1(item: any) {
		item.showEmlPopup1 = false;
	}
	/**
	  * To search clientName/PAN no in list. 
	  */
	searchInList(ev: any) {
		if(ev.target.value.toString().length > 2){
			this.tableLoader = true;
			if (ev && ev.target && ev.target.value) {
				const text = ev.target.value.toLowerCase().trim().replace(/\s\s+/g, ' ');
				this.folioList = this.AllClients.filter((c: any) => (c.clientName.toLowerCase().trim().indexOf(text) > -1) || (c.clientPan.toLowerCase().trim().indexOf(text) > -1));
				this.tableLoader = false;
			} else {
				this.tableLoader = false;
				this.folioList = this.AllClients;
			}
		}
	}

	// To open filter option's popup.
	onFilterIcon() {
		this.isDiv = true;
		this.visible = !this.visible
	}

	close() {
		this.isDiv = false;
		this.visible = false;
	}
	/**
	 * On click of apply btn from filter popup.
	 */
	onFilterApply() {
		this.onFilterIcon();
		this.tableLoader = true;
		this.folioList = [];
		this.close();
		this.getToken();
	}

	/**
	 * On click of clear all btn from filter popup.
	 */
	onClearAll() {
		this.filterBy = '';
		this.onFilterIcon();
		this.tableLoader = true;
		this.folioList = [];
		this.close();
		this.getToken();
	}

	/**
	 * On download excel.
	 */
	downloadReprt() {
		this.commonService.setClevertapEvent('Summaries_foliowise', { 'Login ID': localStorage.getItem('userId1') });
		this.commonService.setClevertapEvent('Foliowise_Download', { 'PartnerCode': localStorage.getItem('userId1') });
		let info: any = [];
		let head = [["Folio Number", "Scheme Name", "Client Name", "Client Code", "PAN No.", "Subbroker Code", "Mobile No.", "Email ID", "Reason", "iifl Email", "iifl Mobile No"]];
		this.AllClients.forEach((element: any) => {
			info.push([element.fNumber, element.schemeName, element.clientName, element.clientCode, element.clientPan, element.partnerCode, element.rtamobileno, element.rtaemail, element.reason, element.iiflemail, element.iiflmobileno])
		})
		if (this.AllClients && this.AllClients.length > 0) {
			this.commonService.setClevertapEvent('Foliowise_Download');
			//Create a workbook with a worksheet
			let workbook = new Workbook();
			let worksheet = workbook.addWorksheet('Foliowise Client Details');
			// worksheet.mergeCells('C1', 'F4');

			let titleRow = worksheet.getCell('C1');
			titleRow.font = {
				name: 'Calibri',
				size: 16,
				underline: 'single',
				bold: true,
				color: { argb: '0085A3' }
			}
			titleRow.alignment = { vertical: 'middle', horizontal: 'center' }
			let headerRow = worksheet.addRow(head[0]);
			headerRow.eachCell((cell, number) => {
				cell.fill = {
					type: 'pattern',
					pattern: 'solid',
					fgColor: { argb: '4167B8' },
					bgColor: { argb: '' },

				}
				cell.font = {
					bold: true,
					color: { argb: 'FFFFFF' },
					size: 12,

				}
			})

			//Adding Data with Conditional Formatting
			info.forEach((d: any) => {
				let row = worksheet.addRow(d);
				row.eachCell((cell: any) => {
					if (cell.value == 'Mobile mismatch') {
						cell['_row']._cells[6].fill = { type: "pattern", pattern: "solid", fgColor: { argb: "F3FF33" } };
					} else if (cell.value == 'Email mismatch') {
						cell['_row']._cells[7].fill = { type: "pattern", pattern: "solid", fgColor: { argb: "F3FF33" } };
					} else if (cell.value == 'Both mismatch') {
						cell['_row']._cells[6].fill = { type: "pattern", pattern: "solid", fgColor: { argb: "F3FF33" } };
						cell['_row']._cells[7].fill = { type: "pattern", pattern: "solid", fgColor: { argb: "F3FF33" } };
					}
					cell.font = { name: 'Calibri', family: 4, size: 11 };
				})
			}
			);
			worksheet.getColumn(1).width = 13;
			worksheet.getColumn(2).width = 35;
			worksheet.getColumn(3).width = 22;
			worksheet.getColumn(4).width = 10;
			worksheet.getColumn(5).width = 12;
			worksheet.getColumn(6).width = 9;
			worksheet.getColumn(7).width = 11;
			worksheet.getColumn(8).width = 22;
			worksheet.getColumn(9).width = 13;
			worksheet.getColumn(10).width = 27;
			worksheet.getColumn(11).width = 12;

			//Generate & Save Excel File
			workbook.xlsx.writeBuffer().then((data) => {
				let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
				if (this.commonService.isApp()) {
					this.commonService.downloadXlsForMobile(blob, true,"foliowise-client-report");
				}
				else {
					saveAs(blob, "foliowise-client-report" + '.xlsx');
				}
			})
		} else {
			this.toast.displayToast('No Data Found');
		}
	}
}