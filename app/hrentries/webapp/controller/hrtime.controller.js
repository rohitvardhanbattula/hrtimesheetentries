sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/library",
    "sap/ui/export/library",
    "sap/m/Dialog",
    "sap/m/library",
    "sap/m/Button",
    "sap/m/Text",
    "sap/ui/model/Sorter",
    "sap/ui/model/Filter",
    "sap/m/SearchField",
    "sap/ui/table/Column",
    "sap/m/Column",
    "sap/m/Label",
    "sap/ui/model/type/String",
    "sap/ui/comp/library",
    "sap/ui/model/FilterOperator",
    "sap/ui/core/Fragment",
    "sap/ui/core/message/Message",
    "sap/ui/model/json/JSONModel"
], (Controller, coreLibrary, exportLibrary, Dialog, mobileLibrary, Button, Text, Sorter, Filter,
    SearchField, UIColumn, MColumn, Label, TypeString, compLibrary, FilterOperator, Fragment, Message, JSONModel) => {
    "use strict";
    var oModel, oAddEntryModel, oEmployeeModel, oWbsModel, oTaskModel;
    var DateValue1, DateValue2;
    var ValueState = coreLibrary.ValueState;
    var addDefaultEntries = [];
    var i;
    var oDialogCreate;
    var savecount = 0;
    var MessageType = coreLibrary.MessageType;
    var DialogType = mobileLibrary.DialogType;
    var ButtonType = mobileLibrary.ButtonType;
    var oBusyDialogAdd;
    return Controller.extend("hrentries.hrentries.controller.hrtime", {
        onInit() {
            var that = this;
            oModel = this.getOwnerComponent().getModel();
            oEmployeeModel = this.getOwnerComponent().getModel("EmployeeService");
            oWbsModel = this.getOwnerComponent().getModel("WbselementService");
            oTaskModel = this.getOwnerComponent().getModel("TaskService");
            that.getView().setModel(oEmployeeModel);
            that.getView().setModel(oWbsModel, "WbsElement");
            that.getView().setModel(oTaskModel, "Tasks");
        },
        onFilter: function () {
            var EmployeeId = this.getView().byId("id_employee_extid");
            var oEmployeevalue = EmployeeId.getValue();
            var Date1 = DateValue1;
            var Date2 = DateValue2;
            this._bindtimesheet(oEmployeevalue, Date1, Date2);
        },
        _bindtimesheet: function (oEmployeeId, oDate1, oDate2) {
            var oFilter = [];
            var oTimesheetData, that, datevalue, filterUser, filterdate1, filterdate2;
            that = this;
            oTimesheetData = new sap.ui.model.json.JSONModel();
            filterUser = new sap.ui.model.Filter("PersonWorkAgreementExternalID", "EQ", oEmployeeId);
            oFilter.push(filterUser);
            if (oDate1 && oDate2) {
                var oDateRange = oDate1 + 'T00:00:00Z';
                var oDateRangeto = oDate2 + 'T23:59:59Z';
                var CreatedAtFilter = new sap.ui.model.Filter("TimeSheetDate", "BT", oDateRange, oDateRangeto);
                oFilter.push(CreatedAtFilter);
            } else if (oDate1) {
                var oDateRangefrom = oDate1 + 'T00:00:00Z';
                var oDateRangeto = oDate1 + 'T23:59:59Z';
                var CreatedAtFilter = new sap.ui.model.Filter("TimeSheetDate", "BT", oDateRangefrom, oDateRangeto);
                oFilter.push(CreatedAtFilter);
            }
            var oBusyDialog = new sap.m.BusyDialog({
                title: "Loading Data",
                text: "Please wait....."
            });
            oBusyDialog.open();
            oModel.read("/MyTimesheet", {
                filters: oFilter,
                urlParameters: { "$top": 999999 },
                success: function (response) {
                    var Title;
                    console.log(response);
                    console.log(response.results);
                    oTimesheetData.setData(response.results);
                    that.getView().setModel(oTimesheetData, "Timesheet");
                    oBusyDialog.close();
                }.bind(this),
                error: function (error) {
                    console.log(error);
                    oBusyDialog.close();
                }.bind(this)
            });
        },
        _datediff: function (oDate1, oDate2) {
            const _MS_PER_DAY = 1000 * 60 * 60 * 24;
            // Discard the time and time-zone information.
            const utc1 = Date.UTC(oDate1.getFullYear(), oDate1.getMonth(), oDate1.getDate());
            const utc2 = Date.UTC(oDate2.getFullYear(), oDate2.getMonth(), oDate2.getDate());

            return Math.floor((utc2 - utc1) / _MS_PER_DAY);
        },
        handleDateChange: function (oEvent) {
            var searchBtn = this.getView().byId("id_search");
            var oRangeDate = [],
                sFrom = oEvent.getParameter("from"),
                sTo = oEvent.getParameter("to"),
                svalue = oEvent.getParameter("value"),
                bValid = oEvent.getParameter("valid"),
                oEventSource = oEvent.getSource();
            if (bValid) {
                oEventSource.setValueState(ValueState.None);
                oRangeDate = svalue.split("–");
                if (oRangeDate.length > 1) {
                    DateValue1 = oRangeDate[0].trim();
                    DateValue2 = oRangeDate[1].trim();
                    var diff = this._datediff(sFrom, sTo);
                    if (diff > 6) {
                        oEventSource.setValueState(ValueState.Error);
                        oEventSource.setValueStateText("Date Range should be with in 7 days");
                        searchBtn.setEnabled(false);
                    } else {
                        oEventSource.setValueState(ValueState.None);
                        oEventSource.setValueStateText("");
                        searchBtn.setEnabled(true);
                    }
                    console.log(diff);
                } else {
                    DateValue1 = oRangeDate[0].trim();
                    DateValue2 = oRangeDate[0].trim();
                    searchBtn.setEnabled(true);
                }
            } else {
                oEventSource.setValueState(ValueState.Error);
                oEventSource.setValueStateText("Invalid Date");
                searchBtn.setEnabled(false);
            }
        },
        onEmployeeVH: function () {
            this._oBasicSearchFieldWithSuggestions = new SearchField();
            this.pDialogWithSuggestions = this.loadFragment({
                name: "hrentries.hrentries.view.EmployeeVH"
            }).then(function (oDialogSuggestions) {
                var oFilterBar = oDialogSuggestions.getFilterBar(), oColumnUserID, oColumnEmployeeExtId, oColumnEmpName,
                    oColumnEmployeeId, oColumnBusinessPartner, oUserIdVH, oCompanyCodeVH, oCostcenterVH;
                this._oVHDWithSuggestions = oDialogSuggestions;
                this.getView().addDependent(oDialogSuggestions);
                // Set key fields for filtering in the Define Conditions Tab
                oDialogSuggestions.setRangeKeyFields([{
                    label: "User Name",
                    key: "UserName",
                    type: "string",
                    typeInstance: new TypeString({}, {
                        maxLength: 10
                    })
                }]);
                // Set Basic Search for FilterBar
                oFilterBar.setFilterBarExpanded(false);
                oFilterBar.setBasicSearch(this._oBasicSearchFieldWithSuggestions);

                // Trigger filter bar search when the basic search is fired
                this._oBasicSearchFieldWithSuggestions.attachSearch(function () {
                    oFilterBar.search();
                });
                oDialogSuggestions.getTableAsync().then(function (oTable) {
                    // For Desktop and tabled the default table is sap.ui.table.Table
                    if (oTable.bindRows) {
                        // Bind rows to the ODataModel and add columns
                        oTable.bindAggregation("rows", {
                            path: "/MyEmployees",
                            events: {
                                dataReceived: function () {
                                    oDialogSuggestions.update();
                                }
                            }
                        });
                        oColumnUserID = new UIColumn({ label: new Label({ text: "User Name" }), template: new Text({ wrapping: false, text: "{UserName}" }) });
                        oColumnUserID.data({
                            fieldName: "UserName"
                        });
                        oTable.addColumn(oColumnUserID);

                        oColumnEmployeeExtId = new UIColumn({ label: new Label({ text: "Employee External Id" }), template: new Text({ wrapping: false, text: "{PersonWorkAgreementExternalID}" }) });
                        oColumnEmployeeExtId.data({
                            fieldName: "PersonWorkAgreementExternalID"
                        });
                        oTable.addColumn(oColumnEmployeeExtId);

                        oColumnEmpName = new UIColumn({ label: new Label({ text: "Employee Name" }), template: new Text({ wrapping: false, text: "{PersonFullName}" }) });
                        oColumnEmpName.data({
                            fieldName: "PersonFullName"
                        });
                        oTable.addColumn(oColumnEmpName);

                        oColumnEmployeeId = new UIColumn({ label: new Label({ text: "Employee Worker ID" }), template: new Text({ wrapping: false, text: "{PersonWorkAgreement}" }) });
                        oColumnEmployeeId.data({
                            fieldName: "PersonWorkAgreement"
                        });
                        oTable.addColumn(oColumnEmployeeId);

                        oColumnBusinessPartner = new UIColumn({ label: new Label({ text: "Business Partner" }), template: new Text({ wrapping: false, text: "{BusinessPartner}" }) });
                        oColumnBusinessPartner.data({
                            fieldName: "BusinessPartner"
                        });
                        oTable.addColumn(oColumnBusinessPartner);

                        oUserIdVH = new UIColumn({ label: new Label({ text: "User Id" }), template: new Text({ wrapping: false, text: "{UserID}" }) });
                        oUserIdVH.data({
                            fieldName: "UserID"
                        });
                        oTable.addColumn(oUserIdVH);

                        oCompanyCodeVH = new UIColumn({ label: new Label({ text: "Company Code" }), template: new Text({ wrapping: false, text: "{CompanyCode}" }) });
                        oCompanyCodeVH.data({
                            fieldName: "CompanyCode"
                        });
                        oTable.addColumn(oCompanyCodeVH);

                        oCostcenterVH = new UIColumn({ label: new Label({ text: "Cost Center" }), template: new Text({ wrapping: false, text: "{CostCenter}" }) });
                        oCostcenterVH.data({
                            fieldName: "CostCenter"
                        });
                        oTable.addColumn(oCostcenterVH);
                    }
                }.bind(this));
                oDialogSuggestions.open();
            }.bind(this));

        },
        onValueHelpEmployeeVHOkPress: function (oEvent) {
            var aTokens = oEvent.getParameter("tokens");
            if (aTokens.length > 0) {
                var oText = aTokens[0].getKey();
                var oselectedSet = aTokens[0].getAggregation("customData");
                var oselectedData = oselectedSet[0].getProperty("value");
                var oEmpExtValue = this.byId("id_employee_extid");
                oEmpExtValue.setValue(oselectedData.PersonWorkAgreementExternalID);
                if (oDialogCreate) {
                    var oEmpExtValueadd = this.byId("id_add_employee_extid");
                    oEmpExtValueadd.setValue(oselectedData.PersonWorkAgreementExternalID);
                    var oEmpWrkId = this.byId("id_add_wrkid");
                    var oEmpwrkLabel = this.byId("id_add_wrkid_label");
                    var oCodeLabel = this.byId("id_add_ccode_label");
                    var oCodeId = this.byId("id_add_ccode");
                    var oCodetext = this.byId("id_add_ccodetext");
                    var oCostlabel = this.byId("id_add_ccenter_label");
                    var oCostC = this.byId("id_add_ccenter");
                    var oCostText = this.byId("id_add_ccentertext");
                    oEmpWrkId.setText(oselectedData.PersonWorkAgreement);
                    oCodeId.setText(oselectedData.CompanyCode);
                    oCodetext.setText(oselectedData.CompanyCodeName);
                    oCostC.setText(oselectedData.CostCenter);
                    oCostText.setText(oselectedData.CostCenterDescription);
                    oEmpWrkId.setVisible(true);
                    oCodeId.setVisible(true);
                    oCostC.setVisible(true);
                    if (oselectedData.PersonWorkAgreement) {
                        oEmpwrkLabel.setVisible(true);
                    }
                    if (oselectedData.CompanyCode) {
                        oCodeLabel.setVisible(true);
                        oCodetext.setVisible(true);
                    }
                    if (oselectedData.CostCenter) {
                        oCostlabel.setVisible(true);
                        oCostText.setVisible(true);
                    }
                }
            }
            this._oVHDWithSuggestions.close();
        },

        onRowSelect: function (oEvent) {

            var oFilter = [];
            var oTimesheetData, that, datevalue, filterUser, filterdate1, filterdate2;
            var sPath = oEvent.getParameter("rowContext").getPath();
            that = this;
            oTimesheetData = new sap.ui.model.json.JSONModel();
            filterUser = new sap.ui.model.Filter("TemplateID", "EQ", oEmployeeId);
            oFilter.push(filterUser);

            var oBusyDialog = new sap.m.BusyDialog({
                title: "Loading Data",
                text: "Please wait....."
            });
            oBusyDialog.open();
            oModel.read("/MyTimesheetTemplate", {
                filters: oFilter,
                urlParameters: { "$top": 999999 },
                success: function (response) {
                    var Title;
                    console.log(response);
                    console.log(response.results);
                    oTimesheetData.setData(response.results);
                    that.getView().setModel(oTimesheetData, "Entries");
                    oBusyDialog.close();
                }.bind(this),
                error: function (error) {
                    console.log(error);
                    oBusyDialog.close();
                }.bind(this)
            });
        },
        onValueHelpEmployeeVHCancelPress: function (oEvent) {
            this._oVHDWithSuggestions.close();
        },
        onValueHelpEmployeeVHAfterClose: function (oEvent) {
            this._oVHDWithSuggestions.destroy();
        },
        onFilterBarWithSuggestionsEmpVHSearch: function (oEvent) {
            var sSearchQuery = this._oBasicSearchFieldWithSuggestions.getValue(),
                aSelectionSet = oEvent.getParameter("selectionSet"),
                aFilters = aSelectionSet.reduce(function (aResult, oControl) {
                    if (oControl.getValue()) {
                        aResult.push(new Filter({
                            path: oControl.getName(),
                            operator: FilterOperator.Contains,
                            value1: oControl.getValue()
                        }));
                    }

                    return aResult;
                }, []);

            aFilters.push(new Filter({
                filters: [
                    new Filter({ path: "PersonFullName", operator: FilterOperator.Contains, value1: sSearchQuery }),
                ],
                and: false
            }));

            this._filterTableWithSuggestions(new Filter({
                filters: aFilters,
                and: true
            }));
        },
        _filterTableWithSuggestions: function (oFilter) {
            var oVHD = this._oVHDWithSuggestions;
            oVHD.getTableAsync().then(function (oTable) {
                if (oTable.bindRows) {
                    oTable.getBinding("rows").filter(oFilter);
                }
                if (oTable.bindItems) {
                    oTable.getBinding("items").filter(oFilter);
                }
                oVHD.update();
            });
        },
        onAdd: function () {
            var that = this;
            oDialogCreate = this.byId("id_dialogaddentries");
            oAddEntryModel = new sap.ui.model.json.JSONModel();
            for (i = 0; i <= 4; i++) {
                var addDefaultEntry = {};
                addDefaultEntry.Id = i;
                addDefaultEntry.TimesheetDate = '';
                addDefaultEntry.TaskType = '';
                addDefaultEntry.WBSElemt = '';
                addDefaultEntry.RecordedHours = '0';
                addDefaultEntry.RecordedQuantity = '0';
                addDefaultEntries.push(addDefaultEntry);
            }
            oAddEntryModel.setData(addDefaultEntries);
            that.getView().setModel(oAddEntryModel, "Entries");
            oAddEntryModel.refresh(true);
            if (!oDialogCreate) {
                oDialogCreate = new sap.ui.xmlfragment(this.getView().getId(), "hrentries.hrentries.view.AddEntries", this);
                this.getView().addDependent(oDialogCreate);
                oDialogCreate.open();
            } else {
                oDialogCreate.open();
            }
            //this.bindTemplate();
            this.bindTemplatedummy();
        },

        bindTemplatedummy: function () {
            const oData = {
                TempTable: [{
                    "TempID": 5000,
                    "TempDesc": "1st Template"
                },
                {
                    "TempID": 5001,
                    "TempDesc": "2nd Template"
                }
                ]
            };
            const oModel = new JSONModel(oData);
			this.getView().setModel(oModel);
        },

        bindTemplate: function (oEvent) {

            //var oFilter = [];
            //var oTimesheetData, that, datevalue, filterUser, filterdate1, filterdate2;
            var oTemplateData, that,
                that = this;
            //oTimesheetData = new sap.ui.model.json.JSONModel();
            oTemplateData = new sap.ui.model.json.JSONModel();
            // filterUser = new sap.ui.model.Filter("PersonWorkAgreementExternalID", "EQ", oEmployeeId);
            // oFilter.push(filterUser);
            // if (oDate1 && oDate2) {
            //     var oDateRange = oDate1 + 'T00:00:00Z';
            //     var oDateRangeto = oDate2 + 'T23:59:59Z';
            //     var CreatedAtFilter = new sap.ui.model.Filter("TimeSheetDate", "BT", oDateRange, oDateRangeto);
            //     oFilter.push(CreatedAtFilter);
            // } else if (oDate1) {
            //     var oDateRangefrom = oDate1 + 'T00:00:00Z';
            //     var oDateRangeto = oDate1 + 'T23:59:59Z';
            //     var CreatedAtFilter = new sap.ui.model.Filter("TimeSheetDate", "BT", oDateRangefrom, oDateRangeto);
            //     oFilter.push(CreatedAtFilter);
            // }
            var oBusyDialog = new sap.m.BusyDialog({
                title: "Loading Data",
                text: "Please wait....."
            });
            oBusyDialog.open();
            oModel.read("/MyTimesheet", {
                //filters: oFilter,
                urlParameters: { "$top": 999999 },
                success: function (response) {
                    //var Title;
                    console.log(response);
                    console.log(response.results);
                    //oTimesheetData.setData(response.results);
                    oTemplateData.setData(response.results);
                    //that.getView().setModel(oTimesheetData, "Timesheet");
                    that.getView().setModel(oTemplateData, "TempTable");
                    oBusyDialog.close();
                }.bind(this),
                error: function (error) {
                    console.log(error);
                    oBusyDialog.close();
                }.bind(this)
            });
        },
        onCloseDialog: function () {
            var that;
            that = this;
            addDefaultEntries = [];
            oAddEntryModel.setData(addDefaultEntries);
            that.getView().setModel(oAddEntryModel, "Entries");
            oAddEntryModel.refresh(true);
            this.getView().byId("id_dialogaddentries").close();
        },
        onsubmitDialog: function () {
            var UploadTable = this.getView().byId("tableId1");
            var uploaddata = UploadTable.getBinding("items");
            var oListData = [];
            oListData = uploaddata.oList;
            console.log(oListData);
            this.getView().byId("id_dialogaddentries").close();
        },
        onsaveDialog: function () {
            var UploadTable = this.getView().byId("tableId1");
            var uploaddata = UploadTable.getBinding("items");
            var oListData = [];
            oListData = uploaddata.oList;
            console.log(oListData);
            this.getView().byId("id_dialogaddentries").close();
        },
        onSaveTemplate: function () {
            var that = this;
            oDialogCreate = this.byId("id_dialog_savetempname");
            if (!oDialogCreate) {
                oDialogCreate = new sap.ui.xmlfragment(this.getView().getId(), "hrentries.hrentries.view.SaveTemplateName", this);
                this.getView().addDependent(oDialogCreate);
                oDialogCreate.open();
            } else {
                oDialogCreate.open();
            }
        },
        onTempNameSave: function () {
            var UploadTable = this.getView().byId("tableId1");
            var uploaddata = UploadTable.getBinding("items");
            var oListData = [];
            oListData = uploaddata.oList;
            console.log(oListData);
            this.getView().byId("id_dialog_savetempname").close();
        },
        onTempNameSave: function () {
            var that;
            that = this;
            oBusyDialogAdd = new sap.m.BusyDialog({
                title: "Saving",
                text: "Please wait....."
            });
            oBusyDialogAdd.open();
            var oListData = [];
            var oRecordEntries = [];
            var oEmpExtValueadd = this.byId("id_add_employee_extid");
            var oEmpWrkId = this.byId("id_add_wrkid");
            var oCodeId = this.byId("id_add_ccode");
            var oCostC = this.byId("id_add_ccenter");
            var oTempId = this.byId("id_save_template_id_inp");
            var oTempDescription = this.byId("id_save_template_desc_inp");
            var RecordTable = this.getView().byId("tableId1");
            var newEntries = RecordTable.getBinding("items");
            oListData = newEntries.oList;
            var oModelupload = this.getOwnerComponent().getModel();
            // oModelupload.setUseBatch(true);
            console.log(oListData);
            var oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({
                pattern: "yyyy-MM-dd"
            });

            var oCheck = this._entriesValidations(oListData);
            if (oCheck === false) {
                for (let i = 0; i < oListData.length; i++) {
                    var TimesheetData = {};
                    TimesheetData.CompanyCode = oCodeId.getText();
                    TimesheetData.PersonWorkAgreementExternalID = oEmpExtValueadd.getValue();
                    TimesheetData.PersonWorkAgreement = oEmpWrkId.getText();
                    var startdate = oDateFormat.format(oListData[i].TimesheetDate);
                    var dayformatting = new Date(startdate);
                    var day = dayformatting.getDay();
                    TimesheetData.TimeSheetDay = day;
                    TimesheetData.TimeSheetDate = startdate + 'T00:00:00';
                    TimesheetData.TimeSheetStatus = '30';
                    TimesheetData.TimeSheetOperation = 'C';
                    TimesheetData.TimeSheetIsExecutedInTestRun = false;
                    TimesheetData.TimeSheetIsReleasedOnSave = true;
                    TimesheetData.TimeSheetDataFields_RecordedHours = oListData[i].RecordedHours;
                    TimesheetData.TimeSheetDataFields_RecordedQuantity = oListData[i].RecordedQuantity;
                    TimesheetData.TimeSheetDataFields_WBSElement = oListData[i].WBSElemt;
                    TimesheetData.TimeSheetDataFields_TimeSheetTaskType = oListData[i].TaskType;
                    TimesheetData.TimeSheetDataFields_ReceiverPubSecFuncnlArea = 'YB40';
                    TimesheetData.TimeSheetDataFields_HoursUnitOfMeasure = 'H';
                    TimesheetData.TimeSheetDataFields_TimeSheetTaskComponent = 'WORK';
                    TimesheetData.TimeSheetDataFields_ControllingArea = 'A000';
                    TimesheetData.TimeSheetDataFields_TimeSheetTaskLevel = 'NONE';
                    TimesheetData.TimeSheetDataFields_ReceiverCostCenter = oCostC.getText();
                    TimesheetData.TimeSheetDataFields_TemplateId = oTempId.getValue();
                    TimesheetData.TimeSheetDataFields_TemplateDescription = oTempDescription.getValue();
                    oRecordEntries[i] = TimesheetData;
                    oModelupload.create("/MyTimesheet", oRecordEntries[i], {
                        success: function (data, response) {
                            savecount = savecount + 1;
                            if (response.statusCode == '201') {
                                if (oListData.length == savecount) {
                                    that._logmessage();
                                }
                            }
                        }.bind(this),
                        error: function (error) {
                            savecount = savecount + 1;
                            if (oListData.length == savecount) {
                                that._logmessage();
                                console.log(error);
                            }
                            alert("error")
                        }.bind(this)
                    });
                }
                //  if (oRecordEntries){
                //      oModelupload.submitChanges();
                // }                 
            } else {
                var oMessage = new Message({
                    message: "Select User Name to auto fill User ID, Worker External ID,Person Worker Agreement ID, Business Partner ID, Employee Name, Company Code,Cost Center",
                    type: MessageType.Error,
                    target: "/Dummy",
                    processor: this.getView().getModel()
                });
                oMsgButton.setIcon("sap-icon://error");
                oMsgButton.setType("Reject");
                sap.ui.getCore().getMessageManager().addMessages(oMessage);
            }
        },
        oncloseTempNameSave: function () {
            this.getView().byId("id_dialog_savetempname").close();
        },
        onSelectTemplate: function () {
            var that = this;
            oDialogCreate = this.byId("id_dialog_selecttempname");
            if (!oDialogCreate) {
                oDialogCreate = new sap.ui.xmlfragment(this.getView().getId(), "hrentries.hrentries.view.SelectTemplate", this);
                this.getView().addDependent(oDialogCreate);
                oDialogCreate.open();
            } else {
                oDialogCreate.open();
            }
        },
        oncloseTempNameSelect: function () {
            this.getView().byId("id_dialog_selecttempname").close();
        },
        onAddEntry: function (oEvent) {
            var that = this;
            var addDefaultEntry = {};
            i = i + 1;
            addDefaultEntry.Id = i;
            addDefaultEntry.TimesheetDate = '';
            addDefaultEntry.TaskType = '';
            addDefaultEntry.WBSElemt = '';
            addDefaultEntry.RecordedHours = '0';
            addDefaultEntry.RecordedQuantity = '0';
            addDefaultEntries.push(addDefaultEntry);
            oAddEntryModel.setData(addDefaultEntries);
            that.getView().setModel(oAddEntryModel, "Entries");
            oAddEntryModel.refresh(true);
        },
        deleteRow: function (oEvent) {
            var that;
            that = this;
            var getRemoveIndex = oEvent.getParameter("listItem");
            var oCells = getRemoveIndex.getCells();
            var sId = oCells[0].getValue();
            var iId = sId * 1;
            const index = addDefaultEntries.findIndex((obj) => (obj.Id) === iId);
            if (index !== -1) {
                addDefaultEntries.splice(index, 1);
                oAddEntryModel.setData(addDefaultEntries);
                that.getView().setModel(oAddEntryModel, "Entries");
                oAddEntryModel.refresh(true);
            }
            var oTable = this.getView().byId("tableId1");
            oTable.removeItem(oEvent.getParameter("listItem"));
        },
        taskChange: function (oEvent) {
            var oSaveBtn = this.getView().byId("id_add_entrysave");
            var oSubmitBtn = this.getView().byId("id_add_entry_submit");
            var oValidatedComboBox = oEvent.getSource(),
                sSelectedKey = oValidatedComboBox.getSelectedKey(),
                sValue = oValidatedComboBox.getValue();
            if (!sSelectedKey && sValue) {
                oValidatedComboBox.setValueState(ValueState.Error);
                oValidatedComboBox.setValueStateText("Please enter a valid Task Type");
                oSaveBtn.setEnabled(false);
                oSubmitBtn.setEnabled(false);
            } else {
                oValidatedComboBox.setValueState(ValueState.None);
                oSaveBtn.setEnabled(true);
                oSubmitBtn.setEnabled(true);
            }
        },
        wbsChange: function (oEvent) {
            var oSaveBtn = this.getView().byId("id_add_entrysave");
            var oSubmitBtn = this.getView().byId("id_add_entry_submit");
            var oValidatedComboBox = oEvent.getSource(),
                sSelectedKey = oValidatedComboBox.getSelectedKey(),
                sValue = oValidatedComboBox.getValue();
            if (!sSelectedKey && sValue) {
                oValidatedComboBox.setValueState(ValueState.Error);
                oValidatedComboBox.setValueStateText("Please enter a valid WBS Element");
                oSaveBtn.setEnabled(false);
                oSubmitBtn.setEnabled(false);
            } else {
                oValidatedComboBox.setValueState(ValueState.None);
                oSaveBtn.setEnabled(true);
                oSubmitBtn.setEnabled(true);
            }
        },
        handleDateChangeadd_entries: function (oEvent) {
            var oSaveBtn = this.getView().byId("id_add_entrysave");
            var oSubmitBtn = this.getView().byId("id_add_entry_submit");
            var oRangeDate = [],
                sFrom = oEvent.getParameter("from"),
                sTo = oEvent.getParameter("to"),
                svalue = oEvent.getParameter("value"),
                bValid = oEvent.getParameter("valid"),
                oEventSource = oEvent.getSource();
            if (bValid) {
                oEventSource.setValueState(ValueState.None);
                oRangeDate = svalue.split("–");
                if (oRangeDate.length > 1) {
                    DateValue1 = oRangeDate[0].trim();
                    DateValue2 = oRangeDate[1].trim();
                    var diff = this._datediff(sFrom, sTo);
                    if (diff > 6) {
                        oEventSource.setValueState(ValueState.Error);
                        oEventSource.setValueStateText("Date Range should be with in 7 days");
                        oSaveBtn.setEnabled(false);
                        oSubmitBtn.setEnabled(false);
                    } else {
                        oEventSource.setValueState(ValueState.None);
                        oEventSource.setValueStateText("");
                        oSaveBtn.setEnabled(true);
                        oSubmitBtn.setEnabled(true);
                    }
                } else {
                    DateValue1 = oRangeDate[0].trim();
                    DateValue2 = oRangeDate[0].trim();
                    oSaveBtn.setEnabled(true);
                    oSubmitBtn.setEnabled(true);
                }
            } else {
                oEventSource.setValueState(ValueState.Error);
                oEventSource.setValueStateText("Invalid Date");
                oSaveBtn.setEnabled(false);
                oSubmitBtn.setEnabled(false);
            }
        },
        onsubmitDialog: function () {
            var that;
            that = this;
            oBusyDialogAdd = new sap.m.BusyDialog({
                title: "Saving",
                text: "Please wait....."
            });
            oBusyDialogAdd.open();
            var oListData = [];
            var oRecordEntries = [];
            var oEmpExtValueadd = this.byId("id_add_employee_extid");
            var oEmpWrkId = this.byId("id_add_wrkid");
            var oCodeId = this.byId("id_add_ccode");
            var oCostC = this.byId("id_add_ccenter");
            var RecordTable = this.getView().byId("tableId1");
            var newEntries = RecordTable.getBinding("items");
            oListData = newEntries.oList;
            var oModelupload = this.getOwnerComponent().getModel();
            // oModelupload.setUseBatch(true);
            console.log(oListData);
            var oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({
                pattern: "yyyy-MM-dd"
            });
            var oCheck = this._entriesValidations(oListData);
            if (oCheck === false) {
                for (let i = 0; i < oListData.length; i++) {
                    var TimesheetData = {};
                    TimesheetData.CompanyCode = oCodeId.getText();
                    TimesheetData.PersonWorkAgreementExternalID = oEmpExtValueadd.getValue();
                    TimesheetData.PersonWorkAgreement = oEmpWrkId.getText();
                    var startdate = oDateFormat.format(oListData[i].TimesheetDate);
                    TimesheetData.TimeSheetDate = startdate + 'T00:00:00';
                    TimesheetData.TimeSheetStatus = '30';
                    TimesheetData.TimeSheetOperation = 'C';
                    TimesheetData.TimeSheetIsExecutedInTestRun = false;
                    TimesheetData.TimeSheetIsReleasedOnSave = true;
                    TimesheetData.TimeSheetDataFields_RecordedHours = oListData[i].RecordedHours;
                    TimesheetData.TimeSheetDataFields_RecordedQuantity = oListData[i].RecordedHours;
                    TimesheetData.TimeSheetDataFields_WBSElement = oListData[i].WBSElemt;
                    TimesheetData.TimeSheetDataFields_TimeSheetTaskType = oListData[i].TaskType;
                    TimesheetData.TimeSheetDataFields_ReceiverPubSecFuncnlArea = 'YB40';
                    TimesheetData.TimeSheetDataFields_HoursUnitOfMeasure = 'H';
                    TimesheetData.TimeSheetDataFields_TimeSheetTaskComponent = 'WORK';
                    TimesheetData.TimeSheetDataFields_ControllingArea = 'A000';
                    TimesheetData.TimeSheetDataFields_TimeSheetTaskLevel = 'NONE';
                    TimesheetData.TimeSheetDataFields_ReceiverCostCenter = oCostC.getText();
                    oRecordEntries[i] = TimesheetData;
                    oModelupload.create("/MyTimesheet", oRecordEntries[i], {
                        success: function (data, response) {
                            savecount = savecount + 1;
                            if (response.statusCode == '201') {
                                if (oListData.length == savecount) {
                                    that._logmessage();
                                }
                            }
                        }.bind(this),
                        error: function (error) {
                            savecount = savecount + 1;
                            if (oListData.length == savecount) {
                                that._logmessage();
                                console.log(error);
                            }
                            alert("error")
                        }.bind(this)
                    });
                }
                //  if (oRecordEntries){
                //      oModelupload.submitChanges();
                // }                 
            } else {
                var oMessage = new Message({
                    message: "Select User Name to auto fill User ID, Worker External ID,Person Worker Agreement ID, Business Partner ID, Employee Name, Company Code,Cost Center",
                    type: MessageType.Error,
                    target: "/Dummy",
                    processor: this.getView().getModel()
                });
                oMsgButton.setIcon("sap-icon://error");
                oMsgButton.setType("Reject");
                sap.ui.getCore().getMessageManager().addMessages(oMessage);
            }

        },
        _entriesValidations: function (oList) {
            return false;
        },
        _logmessage: function () {
            var that = this;
            this.oLogMessageDialog = new Dialog({
                type: DialogType.Message,
                title: "Information",
                state: ValueState.Information,
                content: new Text({ text: "Entries Added Successfully." }),
                beginButton: new Button({
                    type: ButtonType.Emphasized,
                    text: "Ok",
                    press: function () {
                        this.oLogMessageDialog.close();
                        oBusyDialogAdd.close();
                    }.bind(this)
                })
            });
            this.oLogMessageDialog.open();
        }

    });
});