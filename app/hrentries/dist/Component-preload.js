//@ui5-bundle hrentries/hrentries/Component-preload.js
sap.ui.require.preload({
	"hrentries/hrentries/Component.js":function(){
sap.ui.define(["sap/ui/core/UIComponent","hrentries/hrentries/model/models"],(e,t)=>{"use strict";return e.extend("hrentries.hrentries.Component",{metadata:{manifest:"json",interfaces:["sap.ui.core.IAsyncContentCreation"]},init(){e.prototype.init.apply(this,arguments);this.setModel(t.createDeviceModel(),"device");this.getRouter().initialize()}})});
},
	"hrentries/hrentries/controller/App.controller.js":function(){
sap.ui.define(["sap/ui/core/mvc/Controller"],e=>{"use strict";return e.extend("hrentries.hrentries.controller.hrtime",{onInit(){}})});
},
	"hrentries/hrentries/controller/hrtime.controller.js":function(){
sap.ui.define(["sap/ui/core/mvc/Controller","sap/ui/core/library","sap/ui/export/library","sap/m/Dialog","sap/m/library","sap/m/Button","sap/m/Text","sap/ui/model/Sorter","sap/ui/model/Filter","sap/m/SearchField","sap/ui/table/Column","sap/m/Column","sap/m/Label","sap/ui/model/type/String","sap/ui/comp/library","sap/ui/model/FilterOperator","sap/ui/core/Fragment","sap/ui/core/message/Message"],(e,t,a,s,i,r,n,o,l,d,g,u,m,h,c,p,f,v)=>{"use strict";var b,y,w,S,_;var V,T;var D=t.ValueState;var I=[];var C;var E;var x=0;var P=t.MessageType;var M=i.DialogType;var W=i.ButtonType;var F;return e.extend("hrentries.hrentries.controller.hrtime",{onInit(){var e=this;b=this.getOwnerComponent().getModel();w=this.getOwnerComponent().getModel("EmployeeService");S=this.getOwnerComponent().getModel("WbselementService");_=this.getOwnerComponent().getModel("TaskService");e.getView().setModel(w);e.getView().setModel(S,"WbsElement");e.getView().setModel(_,"Tasks")},onFilter:function(){var e=this.getView().byId("id_employee_extid");var t=e.getValue();var a=V;var s=T;this._bindtimesheet(t,a,s)},_bindtimesheet:function(e,t,a){var s=[];var i,r,n,o,l,d;r=this;i=new sap.ui.model.json.JSONModel;o=new sap.ui.model.Filter("PersonWorkAgreementExternalID","EQ",e);s.push(o);if(t&&a){var g=t+"T00:00:00Z";var u=a+"T23:59:59Z";var m=new sap.ui.model.Filter("TimeSheetDate","BT",g,u);s.push(m)}else if(t){var h=t+"T00:00:00Z";var u=t+"T23:59:59Z";var m=new sap.ui.model.Filter("TimeSheetDate","BT",h,u);s.push(m)}var c=new sap.m.BusyDialog({title:"Loading Data",text:"Please wait....."});c.open();b.read("/MyTimesheet",{filters:s,urlParameters:{$top:999999},success:function(e){var t;console.log(e);console.log(e.results);i.setData(e.results);r.getView().setModel(i,"Timesheet");c.close()}.bind(this),error:function(e){console.log(e);c.close()}.bind(this)})},_datediff:function(e,t){const a=1e3*60*60*24;const s=Date.UTC(e.getFullYear(),e.getMonth(),e.getDate());const i=Date.UTC(t.getFullYear(),t.getMonth(),t.getDate());return Math.floor((i-s)/a)},handleDateChange:function(e){var t=this.getView().byId("id_search");var a=[],s=e.getParameter("from"),i=e.getParameter("to"),r=e.getParameter("value"),n=e.getParameter("valid"),o=e.getSource();if(n){o.setValueState(D.None);a=r.split("–");if(a.length>1){V=a[0].trim();T=a[1].trim();var l=this._datediff(s,i);if(l>6){o.setValueState(D.Error);o.setValueStateText("Date Range should be with in 7 days");t.setEnabled(false)}else{o.setValueState(D.None);o.setValueStateText("");t.setEnabled(true)}console.log(l)}else{V=a[0].trim();T=a[0].trim();t.setEnabled(true)}}else{o.setValueState(D.Error);o.setValueStateText("Invalid Date");t.setEnabled(false)}},onEmployeeVH:function(){this._oBasicSearchFieldWithSuggestions=new d;this.pDialogWithSuggestions=this.loadFragment({name:"hrentries.hrentries.view.EmployeeVH"}).then(function(e){var t=e.getFilterBar(),a,s,i,r,o,l,d,u;this._oVHDWithSuggestions=e;this.getView().addDependent(e);e.setRangeKeyFields([{label:"User Name",key:"UserName",type:"string",typeInstance:new h({},{maxLength:10})}]);t.setFilterBarExpanded(false);t.setBasicSearch(this._oBasicSearchFieldWithSuggestions);this._oBasicSearchFieldWithSuggestions.attachSearch(function(){t.search()});e.getTableAsync().then(function(t){if(t.bindRows){t.bindAggregation("rows",{path:"/MyEmployees",events:{dataReceived:function(){e.update()}}});a=new g({label:new m({text:"User Name"}),template:new n({wrapping:false,text:"{UserName}"})});a.data({fieldName:"UserName"});t.addColumn(a);s=new g({label:new m({text:"Employee External Id"}),template:new n({wrapping:false,text:"{PersonWorkAgreementExternalID}"})});s.data({fieldName:"PersonWorkAgreementExternalID"});t.addColumn(s);i=new g({label:new m({text:"Employee Name"}),template:new n({wrapping:false,text:"{PersonFullName}"})});i.data({fieldName:"PersonFullName"});t.addColumn(i);r=new g({label:new m({text:"Employee Worker ID"}),template:new n({wrapping:false,text:"{PersonWorkAgreement}"})});r.data({fieldName:"PersonWorkAgreement"});t.addColumn(r);o=new g({label:new m({text:"Business Partner"}),template:new n({wrapping:false,text:"{BusinessPartner}"})});o.data({fieldName:"BusinessPartner"});t.addColumn(o);l=new g({label:new m({text:"User Id"}),template:new n({wrapping:false,text:"{UserID}"})});l.data({fieldName:"UserID"});t.addColumn(l);d=new g({label:new m({text:"Company Code"}),template:new n({wrapping:false,text:"{CompanyCode}"})});d.data({fieldName:"CompanyCode"});t.addColumn(d);u=new g({label:new m({text:"Cost Center"}),template:new n({wrapping:false,text:"{CostCenter}"})});u.data({fieldName:"CostCenter"});t.addColumn(u)}}.bind(this));e.open()}.bind(this))},onValueHelpEmployeeVHOkPress:function(e){var t=e.getParameter("tokens");if(t.length>0){var a=t[0].getKey();var s=t[0].getAggregation("customData");var i=s[0].getProperty("value");var r=this.byId("id_employee_extid");r.setValue(i.PersonWorkAgreementExternalID);if(E){var n=this.byId("id_add_employee_extid");n.setValue(i.PersonWorkAgreementExternalID);var o=this.byId("id_add_wrkid");var l=this.byId("id_add_wrkid_label");var d=this.byId("id_add_ccode_label");var g=this.byId("id_add_ccode");var u=this.byId("id_add_ccodetext");var m=this.byId("id_add_ccenter_label");var h=this.byId("id_add_ccenter");var c=this.byId("id_add_ccentertext");o.setText(i.PersonWorkAgreement);g.setText(i.CompanyCode);u.setText(i.CompanyCodeName);h.setText(i.CostCenter);c.setText(i.CostCenterDescription);o.setVisible(true);g.setVisible(true);h.setVisible(true);if(i.PersonWorkAgreement){l.setVisible(true)}if(i.CompanyCode){d.setVisible(true);u.setVisible(true)}if(i.CostCenter){m.setVisible(true);c.setVisible(true)}}}this._oVHDWithSuggestions.close()},onValueHelpEmployeeVHCancelPress:function(e){this._oVHDWithSuggestions.close()},onValueHelpEmployeeVHAfterClose:function(e){this._oVHDWithSuggestions.destroy()},onFilterBarWithSuggestionsEmpVHSearch:function(e){var t=this._oBasicSearchFieldWithSuggestions.getValue(),a=e.getParameter("selectionSet"),s=a.reduce(function(e,t){if(t.getValue()){e.push(new l({path:t.getName(),operator:p.Contains,value1:t.getValue()}))}return e},[]);s.push(new l({filters:[new l({path:"PersonFullName",operator:p.Contains,value1:t})],and:false}));this._filterTableWithSuggestions(new l({filters:s,and:true}))},_filterTableWithSuggestions:function(e){var t=this._oVHDWithSuggestions;t.getTableAsync().then(function(a){if(a.bindRows){a.getBinding("rows").filter(e)}if(a.bindItems){a.getBinding("items").filter(e)}t.update()})},onAdd:function(){var e=this;E=this.byId("id_dialogaddentries");y=new sap.ui.model.json.JSONModel;for(C=0;C<=4;C++){var t={};t.Id=C;t.TimesheetDate="";t.TaskType="";t.WBSElemt="";t.RecordedHours="0";t.RecordedQuantity="0";I.push(t)}y.setData(I);e.getView().setModel(y,"Entries");y.refresh(true);if(!E){E=new sap.ui.xmlfragment(this.getView().getId(),"hrentries.hrentries.view.AddEntries",this);this.getView().addDependent(E);E.open()}else{E.open()}},onCloseDialog:function(){var e;e=this;I=[];y.setData(I);e.getView().setModel(y,"Entries");y.refresh(true);this.getView().byId("id_dialogaddentries").close()},onsubmitDialog:function(){var e=this.getView().byId("tableId1");var t=e.getBinding("items");var a=[];a=t.oList;console.log(a);this.getView().byId("id_dialogaddentries").close()},onsaveDialog:function(){var e=this.getView().byId("tableId1");var t=e.getBinding("items");var a=[];a=t.oList;console.log(a);this.getView().byId("id_dialogaddentries").close()},onAddEntry:function(e){var t=this;var a={};C=C+1;a.Id=C;a.TimesheetDate="";a.TaskType="";a.WBSElemt="";a.RecordedHours="0";a.RecordedQuantity="0";I.push(a);y.setData(I);t.getView().setModel(y,"Entries");y.refresh(true)},deleteRow:function(e){var t;t=this;var a=e.getParameter("listItem");var s=a.getCells();var i=s[0].getValue();var r=i*1;const n=I.findIndex(e=>e.Id===r);if(n!==-1){I.splice(n,1);y.setData(I);t.getView().setModel(y,"Entries");y.refresh(true)}var o=this.getView().byId("tableId1");o.removeItem(e.getParameter("listItem"))},taskChange:function(e){var t=this.getView().byId("id_add_entrysave");var a=this.getView().byId("id_add_entry_submit");var s=e.getSource(),i=s.getSelectedKey(),r=s.getValue();if(!i&&r){s.setValueState(D.Error);s.setValueStateText("Please enter a valid Task Type");t.setEnabled(false);a.setEnabled(false)}else{s.setValueState(D.None);t.setEnabled(true);a.setEnabled(true)}},wbsChange:function(e){var t=this.getView().byId("id_add_entrysave");var a=this.getView().byId("id_add_entry_submit");var s=e.getSource(),i=s.getSelectedKey(),r=s.getValue();if(!i&&r){s.setValueState(D.Error);s.setValueStateText("Please enter a valid WBS Element");t.setEnabled(false);a.setEnabled(false)}else{s.setValueState(D.None);t.setEnabled(true);a.setEnabled(true)}},handleDateChangeadd_entries:function(e){var t=this.getView().byId("id_add_entrysave");var a=this.getView().byId("id_add_entry_submit");var s=[],i=e.getParameter("from"),r=e.getParameter("to"),n=e.getParameter("value"),o=e.getParameter("valid"),l=e.getSource();if(o){l.setValueState(D.None);s=n.split("–");if(s.length>1){V=s[0].trim();T=s[1].trim();var d=this._datediff(i,r);if(d>6){l.setValueState(D.Error);l.setValueStateText("Date Range should be with in 7 days");t.setEnabled(false);a.setEnabled(false)}else{l.setValueState(D.None);l.setValueStateText("");t.setEnabled(true);a.setEnabled(true)}}else{V=s[0].trim();T=s[0].trim();t.setEnabled(true);a.setEnabled(true)}}else{l.setValueState(D.Error);l.setValueStateText("Invalid Date");t.setEnabled(false);a.setEnabled(false)}},onsubmitDialog:function(){var e;e=this;F=new sap.m.BusyDialog({title:"Saving",text:"Please wait....."});F.open();var t=[];var a=[];var s=this.byId("id_add_employee_extid");var i=this.byId("id_add_wrkid");var r=this.byId("id_add_ccode");var n=this.byId("id_add_ccenter");var o=this.getView().byId("tableId1");var l=o.getBinding("items");t=l.oList;var d=this.getOwnerComponent().getModel();console.log(t);var g=sap.ui.core.format.DateFormat.getDateInstance({pattern:"yyyy-MM-dd"});var u=this._entriesValidations(t);if(u===false){for(let o=0;o<t.length;o++){var m={};m.CompanyCode=r.getText();m.PersonWorkAgreementExternalID=s.getValue();m.PersonWorkAgreement=i.getText();var h=g.format(t[o].TimesheetDate);m.TimeSheetDate=h+"T00:00:00";m.TimeSheetStatus="30";m.TimeSheetOperation="C";m.TimeSheetIsExecutedInTestRun=false;m.TimeSheetIsReleasedOnSave=true;m.TimeSheetDataFields_RecordedHours=t[o].RecordedHours;m.TimeSheetDataFields_RecordedQuantity=t[o].RecordedHours;m.TimeSheetDataFields_WBSElement=t[o].WBSElemt;m.TimeSheetDataFields_TimeSheetTaskType=t[o].TaskType;m.TimeSheetDataFields_ReceiverPubSecFuncnlArea="YB40";m.TimeSheetDataFields_HoursUnitOfMeasure="H";m.TimeSheetDataFields_TimeSheetTaskComponent="WORK";m.TimeSheetDataFields_ControllingArea="A000";m.TimeSheetDataFields_TimeSheetTaskLevel="NONE";m.TimeSheetDataFields_ReceiverCostCenter=n.getText();a[o]=m;d.create("/MyTimesheet",a[o],{success:function(a,s){x=x+1;if(s.statusCode=="201"){if(t.length==x){e._logmessage()}}}.bind(this),error:function(a){x=x+1;if(t.length==x){e._logmessage();console.log(a)}alert("error")}.bind(this)})}}else{var c=new v({message:"Select User Name to auto fill User ID, Worker External ID,Person Worker Agreement ID, Business Partner ID, Employee Name, Company Code,Cost Center",type:P.Error,target:"/Dummy",processor:this.getView().getModel()});oMsgButton.setIcon("sap-icon://error");oMsgButton.setType("Reject");sap.ui.getCore().getMessageManager().addMessages(c)}},_entriesValidations:function(e){return false},_logmessage:function(){var e=this;this.oLogMessageDialog=new s({type:M.Message,title:"Information",state:D.Information,content:new n({text:"Entries Added Successfully."}),beginButton:new r({type:W.Emphasized,text:"Ok",press:function(){this.oLogMessageDialog.close();F.close()}.bind(this)})});this.oLogMessageDialog.open()}})});
},
	"hrentries/hrentries/i18n/i18n.properties":'# This is the resource bundle for hrentries.hrentries\n\n#Texts for manifest.json\n\n#XTIT: Application name\nappTitle=Timesheet Entries Application\n\n#YDES: Application description\nappDescription=Timesheet Entries Application\n#XTIT: Main view title\ntitle=Timesheet Entries Application\n\naddentriy=Add Timesheet Entries\ndialogsaveButtonText=Save Changes\ndialogsubmitButtonText=Submit Changes\ndialogCancelButtonText=Cancel',
	"hrentries/hrentries/manifest.json":'{"_version":"1.65.0","sap.app":{"id":"hrentries.hrentries","type":"application","i18n":"i18n/i18n.properties","applicationVersion":{"version":"0.0.1"},"title":"{{appTitle}}","description":"{{appDescription}}","resources":"resources.json","sourceTemplate":{"id":"@sap/generator-fiori:basic","version":"1.15.5","toolsId":"9daaa236-8c6a-4c18-8b60-66018070b45a"},"dataSources":{"mainService":{"uri":"odata/v2/CatalogService/","type":"OData","settings":{"annotations":[],"odataVersion":"2.0"}},"EmployeeService":{"uri":"odata/v2/EmployeeService/","type":"OData","settings":{"annotations":[],"odataVersion":"2.0"}},"WbselementService":{"uri":"odata/v2/WbselementService/","type":"OData","settings":{"annotations":[],"odataVersion":"2.0"}},"TaskService":{"uri":"odata/v2/TaskService/","type":"OData","settings":{"annotations":[],"odataVersion":"2.0"}}}},"sap.ui":{"technology":"UI5","icons":{"icon":"","favIcon":"","phone":"","phone@2":"","tablet":"","tablet@2":""},"deviceTypes":{"desktop":true,"tablet":true,"phone":true}},"sap.ui5":{"flexEnabled":true,"dependencies":{"minUI5Version":"1.130.2","libs":{"sap.m":{},"sap.ui.core":{}}},"contentDensities":{"compact":true,"cozy":true},"models":{"i18n":{"type":"sap.ui.model.resource.ResourceModel","settings":{"bundleName":"hrentries.hrentries.i18n.i18n"}},"":{"dataSource":"mainService","preload":true,"settings":{"operationMode":"Server","autoExpandSelect":true,"earlyRequests":true}},"EmployeeService":{"dataSource":"EmployeeService","preload":true,"settings":{"operationMode":"Server","autoExpandSelect":true,"earlyRequests":true}},"WbselementService":{"dataSource":"WbselementService","preload":true,"settings":{"operationMode":"Server","autoExpandSelect":true,"earlyRequests":true}},"TaskService":{"dataSource":"TaskService","preload":true,"settings":{"operationMode":"Server","autoExpandSelect":true,"earlyRequests":true}}},"resources":{"css":[{"uri":"css/style.css"}]},"routing":{"config":{"routerClass":"sap.m.routing.Router","controlAggregation":"pages","controlId":"app","transition":"slide","type":"View","viewType":"XML","path":"hrentries.hrentries.view"},"routes":[{"name":"Routehrtime","pattern":":?query:","target":["Targethrtime"]}],"targets":{"Targethrtime":{"id":"hrtime","name":"hrtime"}}},"rootView":{"viewName":"hrentries.hrentries.view.App","type":"XML","id":"App"}}}',
	"hrentries/hrentries/model/models.js":function(){
sap.ui.define(["sap/ui/model/json/JSONModel","sap/ui/Device"],function(e,n){"use strict";return{createDeviceModel:function(){var i=new e(n);i.setDefaultBindingMode("OneWay");return i}}});
},
	"hrentries/hrentries/view/AddEntries.fragment.xml":'<core:FragmentDefinition xmlns:odata="sap.ui.comp.odata" xmlns="sap.m"\n\txmlns:f="sap.ui.layout.form"\n\txmlns:mvc="sap.ui.core.mvc"\n\txmlns:core="sap.ui.core"><Dialog id="id_dialogaddentries" title="{i18n>addentriy}"><content><VBox id="id_add_vbox" class="sapUiSmallMargin"><f:SimpleForm id="id_add_entries_simpleform" editable="true" layout="ResponsiveGridLayout" title="Selection Screen" labelSpanXL="4" \n                        labelSpanM="4" labelSpanL="3" labelSpanS="12" adjustLabelSpan="false" emptySpanXL="0" emptySpanL="4" emptySpanM="0"\n                        emptySpanS="0" columnsXL="3" columnsL="1" columnsM="1" singleContainerFullSize="false" ><f:content><Label id="id_add_employee_label" text="Employee Id" design="Bold" width="100%" required="true" textAlign="Begin" textDirection="LTR" /><Input id="id_add_employee_extid" change="onChange" showValueHelp="true"  valueHelpRequest=".onEmployeeVH" /><Label id="id_add_wrkid_label" visible="false" text="Employee workagreement Id" design="Bold" width="100%" required="true" textAlign="Begin" textDirection="LTR" /><Text id="id_add_wrkid" visible="false"/><Label id="id_add_ccode_label" visible="false" text="Company Code" design="Bold" width="100%" required="true" textAlign="Begin" textDirection="LTR" /><Text id="id_add_ccode" visible="false"/><Text id="id_add_ccodetext" visible="false"/><Label id="id_add_ccenter_label" visible="false" text="Cost Center" design="Bold" width="100%" required="true" textAlign="Begin" textDirection="LTR" /><Text id="id_add_ccenter" visible="false"/><Text id="id_add_ccentertext" visible="false"/><ToolbarSpacer id="id_toolsbar_add_entry" ></ToolbarSpacer><Label id="id_add_daterangelabel" text="Start Date &amp; End Date" design="Bold" width="100%" required="true" textAlign="Right" textDirection="Inherit"/><DateRangeSelection id="id_add_daterange" calendarWeekNumbering="Default" showCurrentDateButton="true"\n\t\t\t            change="handleDateChangeadd_entries"\n                        value= "{\n\t\t\t\t                    \'type\': \'sap.ui.model.type.DateInterval\',\n\t\t\t\t                    \'formatOptions\': {\n\t\t\t\t\t                \'pattern\': \'yyyy-MM-dd\'\n\t\t\t\t                },\n\t\t\t\t                    \'parts\': [\n\t\t\t\t\t                            {\n\t\t\t\t\t\t                            \'type\': \'sap.ui.model.type.Date\',\n\t\t\t\t\t\t                            \'path\': \'/start\'\n\t\t\t\t\t                            },\n\t\t\t\t\t                            {\n\t\t\t\t\t\t                            \'type\': \'sap.ui.model.type.Date\',\n\t\t\t\t\t\t                            \'path\': \'/end\'\n\t\t\t\t\t                            }\n\t\t\t\t                            ]\n\t\t\t                    }" /></f:content></f:SimpleForm></VBox><VBox class="sapUiSmallMargin" id="tableContainer1"><Table id="tableId1" width="auto" mode="Delete" delete="deleteRow" inset="false" enableBusyIndicator="true"\n\t\t\t\tsticky="ColumnHeaders,HeaderToolbar"\n\t\t\t\tgrowing="true"\n\t\t\t\talternateRowColors="true"\n\t\t\t\tshowNoData="true"\n\t\t\t\titems="{\n\t\t\t\t\t\tpath: \'Entries>/\'\n\t\t\t\t\t}"><headerToolbar><Toolbar id="id_tabletoolbar1"><ToolbarSpacer id="id_tabletoolbar2"></ToolbarSpacer><Button id="id_add_button" text="Add Row" icon="sap-icon://add" type="Emphasized" press="onAddEntry"/></Toolbar></headerToolbar><columns><Column id="id_column1" visible="false"><Text id="id_srno" text="S.No"/></Column><Column id="id_column2"><Text id="id_date" text="Date"/></Column><Column id="id_column3"><Text id="id_tasktype" text="Task Type"/></Column><Column id="id_column4"><Text id="id_wbs_elmt" text="WBS Element"/></Column><Column id="id_column5"><Text id="id_recordedhrs" text="Recorded Hours"/></Column><Column id="id_column6"><Text id="id_recorded_qnty" text="Recorded Quantity"/></Column></columns><items><ColumnListItem id="id_uploadcolumnlist1" vAlign="Middle" ><cells><Input id="_IDsno"                \t   value="{Entries>Id}" /><DatePicker id="_IDGenInput" value= "{\n                                                                                path: \'Entries>TimesheetDate\',\n                                                                                type: \'sap.ui.model.type.DateTime\',\n                                                                                formatOptions: {\n                                                                                                    \'pattern\': \'MM/dd/yyyy\',\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\'strictParsing\': true,\n                                                                                                    \'UTC\': true\n                                                                                                }\n\t\t\t\t\t\t\t\t                                            }"\n\n\n\t\t\t\t\t\t\t        /><ComboBox id="id_taskcombo"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\tshowSecondaryValues="true"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\tfilterSecondaryValues= "true"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\tchange="taskChange"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\tselectedKey="{Entries>TaskType}"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\twidth="100%"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\titems="{\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tpath: \'Tasks>/MyTasks\',\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\ttemplateShareable:false,\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tsorter: { path: \'TimeSheetTaskType\' },\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tlength:999999\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t}"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\teditable="{= ${Entries>WBSElemt} === \'\' ? true : false }"\n\t\t\t\t\t\t\t\t\t\t\t\t><core:ListItem id="id_taskitem" key="{Tasks>TimeSheetTaskType}" text="{Tasks>TimeSheetTaskType}" additionalText="{Tasks>TimeSheetTaskTypeText}"/><layoutData><FlexItemData id="id_taskcombo2" growFactor="1" /></layoutData></ComboBox><ComboBox id="id_wbscombo"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\tshowSecondaryValues="true"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\tfilterSecondaryValues= "true"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\tchange="wbsChange"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\tselectedKey="{Entries>WBSElemt}"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\twidth="100%"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\titems="{\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tpath: \'WbsElement>/MyWbsElement\',\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tfilters: { path: \'Language\', operator: \'EQ\', value1: \'EN\' },\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\ttemplateShareable:false,\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tsorter: { path: \'HierarchyNode\' },\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tlength:999999\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t}"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t editable="{= ${Entries>TaskType} === \'\' ? true : false }"\n\t\t\t\t\t\t\t\t\t\t\t\t><core:ListItem id="id_wbsitem" key="{WbsElement>HierarchyNode}" text="{WbsElement>HierarchyNode}" additionalText="{WbsElement>HierarchyNodeText}"/><layoutData><FlexItemData id="id_wbscombo2" growFactor="1" /></layoutData></ComboBox><Input id="id_hours_add"  \t\t       value="{Entries>RecordedHours}" /><Input id="id_quant_add"  \t\t       value="{Entries>RecordedQuantity}" /></cells></ColumnListItem></items></Table></VBox></content><footer><Toolbar id="id_createtoolbar"><content><Button id="id_alert"\n                        icon="sap-icon://alert"\n                        text="{= ${message>/}.length }"\n                        visible="{= ${message>/}.length > 0 }"\n                        type="Emphasized"\n                        press="onMessagePopoverPress" /><ToolbarSpacer id="id_toolbar1123"/><Button id="id_add_entrysave" icon="sap-icon://save" type="Attention" text="{i18n>dialogsaveButtonText}" press="onsaveDialog"/><Button id="id_add_entry_submit" type="Success" text="{i18n>dialogsubmitButtonText}" press="onsubmitDialog"/><Button id="id_add_entry_close" type="Reject" text="{i18n>dialogCancelButtonText}" press="onCloseDialog"/></content></Toolbar></footer></Dialog></core:FragmentDefinition>',
	"hrentries/hrentries/view/App.view.xml":'<mvc:View controllerName="hrentries.hrentries.controller.App"\n    displayBlock="true"\n    xmlns:mvc="sap.ui.core.mvc"\n    xmlns="sap.m"><App id="app"></App></mvc:View>',
	"hrentries/hrentries/view/EmployeeVH.fragment.xml":'<core:FragmentDefinition xmlns="sap.ui.comp.valuehelpdialog" xmlns:m="sap.m" xmlns:core="sap.ui.core" xmlns:fb="sap.ui.comp.filterbar"><ValueHelpDialog \n\t        id="idemployeesmartvaluehelp"\n\t\t\ttitle="Employee Value Help"\n\t\t\tok=".onValueHelpEmployeeVHOkPress"\n\t\t\tcancel=".onValueHelpEmployeeVHCancelPress"\n\t\t\tafterClose=".onValueHelpEmployeeVHAfterClose"\n\t\t\tsupportRanges="true"\n\t\t\tkey="UserName"\n\t\t\tsupportMultiselect="false"><filterBar><fb:FilterBar id="id_filterbar1" advancedMode="true" search=".onFilterBarWithSuggestionsEmpVHSearch" isRunningInValueHelpDialog="true"><fb:filterGroupItems><fb:FilterGroupItem id="id_filterbargrp1"\n\t\t\t\t\t\t\tgroupName="__$INTERNAL$"\n\t\t\t\t\t\t\tname="UserName"\n\t\t\t\t\t\t\tlabel="User Name"\n\t\t\t\t\t\t\tvisibleInFilterBar="true"><fb:control><m:Input id="id_inputempwrkid" name="UserName"\n\t\t\t\t\t\t\t\t\t showSuggestion="true"\n\t\t\t\t\t\t\t\t\t showValueHelp="false"\n\t\t\t\t\t\t\t\t\t suggestionItems="{\n\t\t\t\t\t\t\t\t\t\tpath: \'/MyEmployees\',\n\t\t\t\t\t\t\t\t\t\tsorter: { path: \'UserName\' }\n\t\t\t\t\t\t\t\t\t}"><core:Item id="id_personwrkagriditemvh" key="{UserName}" text="{UserName}" /></m:Input></fb:control></fb:FilterGroupItem><fb:FilterGroupItem id="id_filterbargrp2"\n\t\t\t\t\t\t\tgroupName="__$INTERNAL$"\n\t\t\t\t\t\t\tname="PersonWorkAgreementExternalID"\n\t\t\t\t\t\t\tlabel="Employee External Id"\n\t\t\t\t\t\t\tvisibleInFilterBar="true"><fb:control><m:Input id="id_inputempidvh" name="PersonWorkAgreementExternalID"\n\t\t\t\t\t\t\t\t\t showSuggestion="true"\n\t\t\t\t\t\t\t\t\t showValueHelp="false"\n\t\t\t\t\t\t\t\t\t suggestionItems="{\n\t\t\t\t\t\t\t\t\t\tpath: \'/MyEmployees\',\n\t\t\t\t\t\t\t\t\t\tsorter: { path: \'PersonWorkAgreementExternalID\' }\n\t\t\t\t\t\t\t\t\t}"><core:Item id="id_empiditemvh" key="{PersonWorkAgreementExternalID}" text="{PersonWorkAgreementExternalID}" /></m:Input></fb:control></fb:FilterGroupItem><fb:FilterGroupItem id="id_filterbargrp3"\n\t\t\t\t\t\t\tgroupName="__$INTERNAL$"\n\t\t\t\t\t\t\tname="PersonFullName"\n\t\t\t\t\t\t\tlabel="Employee Name"\n\t\t\t\t\t\t\tvisibleInFilterBar="true"><fb:control><m:Input id="id_inputempnamevh" name="PersonFullName"\n\t\t\t\t\t\t\t\t\t showSuggestion="true"\n\t\t\t\t\t\t\t\t\t showValueHelp="false"\n\t\t\t\t\t\t\t\t\t suggestionItems="{\n\t\t\t\t\t\t\t\t\t\tpath: \'/MyEmployees\',\n\t\t\t\t\t\t\t\t\t\tsorter: { path: \'PersonFullName\' }\n\t\t\t\t\t\t\t\t\t}"><core:Item id="id_empnameitemvh" key="{PersonFullName}" text="{PersonFullName}" /></m:Input></fb:control></fb:FilterGroupItem></fb:filterGroupItems></fb:FilterBar></filterBar></ValueHelpDialog></core:FragmentDefinition>',
	"hrentries/hrentries/view/hrtime.view.xml":'<mvc:View controllerName="hrentries.hrentries.controller.hrtime"\n    xmlns:mvc="sap.ui.core.mvc"\n    xmlns="sap.m" xmlns:f="sap.ui.layout.form"\n    xmlns:core="sap.ui.core" xmlns:l="sap.ui.layout"><Page showFooter="true" id="page" title="{i18n>title}"><content><VBox id="id_vbox" class="sapUiSmallMargin"><f:SimpleForm id="id_simpleform" editable="true" layout="ResponsiveGridLayout" title="Selection Screen" labelSpanXL="4" \n                        labelSpanM="4" labelSpanL="3" labelSpanS="12" adjustLabelSpan="false" emptySpanXL="0" emptySpanL="4" emptySpanM="0"\n                        emptySpanS="0" columnsXL="2" columnsL="1" columnsM="1" singleContainerFullSize="false" ><f:content><core:Title id="id_stitle" text="Input"></core:Title><Label id="id_employee_label" text="Employee Id" design="Bold" width="100%" required="true" textAlign="Begin" textDirection="LTR" /><Input id="id_employee_extid" change="onChange" showValueHelp="true"  valueHelpRequest=".onEmployeeVH" /><ToolbarSpacer id="id_toolsbar_slectionscreen1" ></ToolbarSpacer><Label id="id_daterangelabel" text="Start Date &amp; End Date" design="Bold" width="100%" required="true" textAlign="Right" textDirection="Inherit"/><DateRangeSelection id="id_daterange" showCurrentDateButton="true"\n\t\t\t            change="handleDateChange"\n                        value= "{\n\t\t\t\t                    \'type\': \'sap.ui.model.type.DateInterval\',\n\t\t\t\t                    \'formatOptions\': {\n\t\t\t\t\t                \'pattern\': \'yyyy-MM-dd\'\n\t\t\t\t                },\n\t\t\t\t                    \'parts\': [\n\t\t\t\t\t                            {\n\t\t\t\t\t\t                            \'type\': \'sap.ui.model.type.Date\',\n\t\t\t\t\t\t                            \'path\': \'/start\'\n\t\t\t\t\t                            },\n\t\t\t\t\t                            {\n\t\t\t\t\t\t                            \'type\': \'sap.ui.model.type.Date\',\n\t\t\t\t\t\t                            \'path\': \'/end\'\n\t\t\t\t\t                            }\n\t\t\t\t                            ]\n\t\t\t                    }" /><ToolbarSpacer id="id_toolsbar_slectionscreen" ></ToolbarSpacer><Button id="id_search" text="Search" width="100%" type="Emphasized" press=".onFilter" class="sapUiSmallMarginEnd" ><layoutData><FlexItemData id="id_itemdata5" growFactor="1" /></layoutData></Button></f:content></f:SimpleForm></VBox><VBox id="id_vboxtable" class="sapUiSmallMargin"><Table width="auto" noDataText="No data" showSeparators="All" growing="true" growingThreshold="20" growingScrollToLoad="true"\n\t\t\t\t\t\titems="{ path: \'Timesheet>/\' }" id="daysTable" showUnread="true" showNoData="false" backgroundDesign="Solid"\n\t\t\t\t\t\tselectionChange="onSelectionChange" mode="MultiSelect" sticky="ColumnHeaders,HeaderToolbar"><columns><Column id="idcolumn1" width="auto" hAlign="Center" vAlign="Top" minScreenWidth="Tablet" demandPopin="true" popinDisplay="Block" mergeDuplicates="false"><header><Text id="idtext1" text="Employee External No" width="auto" maxLines="1" wrapping="true" textAlign="Begin" textDirection="Inherit"/></header><footer/></Column><Column id="idcolumn2" width="auto" hAlign="Center" vAlign="Top" minScreenWidth="Tablet" demandPopin="true" popinDisplay="Block" mergeDuplicates="false"><header><Text id="idtext2" text="Recorded Date" width="auto" maxLines="1" wrapping="false" textAlign="Begin" textDirection="Inherit"/></header><footer/></Column><Column id="idcolumn3" width="auto" hAlign="Center" vAlign="Top" minScreenWidth="Tablet" demandPopin="true" popinDisplay="Block" mergeDuplicates="false"><header><Text id="idtext3" text="Task Type" width="auto" maxLines="1" wrapping="false" textAlign="Begin" textDirection="Inherit"/></header><footer/></Column><Column id="idcolumn4" width="auto" hAlign="Center" vAlign="Top" minScreenWidth="Tablet" demandPopin="true" popinDisplay="Block" mergeDuplicates="false"><header><Text id="idtext4" text="WBS Element" width="auto" maxLines="1" wrapping="false" textAlign="Begin" textDirection="Inherit"/></header><footer/></Column><Column id="idcolumn5" width="auto" hAlign="Center" vAlign="Top" minScreenWidth="Tablet" demandPopin="true" popinDisplay="Block" mergeDuplicates="false"><header><Text id="idtext5" text="Recorded Hours" width="auto" maxLines="1" wrapping="false" textAlign="Begin" textDirection="Inherit"/></header><footer/></Column><Column id="idcolumn6" width="auto" hAlign="Center" vAlign="Top" minScreenWidth="Tablet" demandPopin="true" popinDisplay="Block" mergeDuplicates="false"><header><Text id="idtext6" text="Recorded Quantity" width="auto" maxLines="1" wrapping="false" textAlign="Begin" textDirection="Inherit"/></header><footer/></Column><Column id="idcolumn7" width="auto" hAlign="Center" vAlign="Top" minScreenWidth="Tablet" demandPopin="true" popinDisplay="Block" mergeDuplicates="false"><header><Text id="idtext7" text="Recorded Status" width="auto" maxLines="1" wrapping="false" textAlign="Begin" textDirection="Inherit"/></header><footer/></Column><Column id="idcolumn8" width="auto" hAlign="Center" vAlign="Top" minScreenWidth="Tablet" demandPopin="true" popinDisplay="Block" mergeDuplicates="false"><header><Text id="idtext8" width="auto" maxLines="1" wrapping="false" textAlign="Begin" textDirection="Inherit"/></header><footer/></Column></columns><items><ColumnListItem id="columnList" highlight="None"><cells><Text id="id_cell1" text="{Timesheet>PersonWorkAgreementExternalID}"/><DateTimePicker id="id_cell2" value= "{\n                                                                                                        path: \'Timesheet>TimeSheetDate\',\n                                                                                                        type: \'sap.ui.model.type.DateTime\',\n                                                                                                        formatOptions: {\n                                                                                                                            \'pattern\': \'MM/dd/yyyy\',\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\'strictParsing\': true,\n                                                                                                                            \'UTC\': true\n                                                                                                                        }\n\t\t\t\t\t\t\t\t                                                                }"\n                                                                                                editable="false"\n\t\t\t\t\t\t\t        /><Text id="id_cell3" text="{Timesheet>TimeSheetTaskType}"/><Text id="id_cell4" text="{Timesheet>WBSElementInternalID}"/><Text id="id_cell5" text="{Timesheet>RecordedHours}"/><Text id="id_cell6" text="{Timesheet>RecordedQuantity}"/><Text id="id_cell7" text="{Timesheet>TimeSheetStatus}"/><Button id="id_cell8" type="Reject" iconFirst="true" width="auto"\n\t\t\t\t\t\t\t\t\ticonDensityAware="false" press="ondelete" icon="sap-icon://delete"/></cells></ColumnListItem></items></Table></VBox></content><footer><Bar id="id_button_footer" design="Auto"><contentRight><Button id="id_button_add" text="Add New Entries" type="Accept" iconFirst="true" width="auto" enabled="true" visible="{path: \'/buttonsVisible/edit\'}" activeIcon="sap-icon://edit"\n\t\t\t\t\t\t\tpress="onAdd" icon="sap-icon://add"/><Button id="id_button_cancel" text="Delete" type="Reject" iconFirst="true" width="auto" visible="{path: \'/buttonsVisible/cancel\'}"\n\t\t\t\t\t\t\ticonDensityAware="false" press="ondelete" icon="sap-icon://delete"/></contentRight></Bar></footer></Page></mvc:View>'
});
//# sourceMappingURL=Component-preload.js.map
