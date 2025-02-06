namespace db;
using { cuid } from '@sap/cds/common';

context master {
    entity TemplateTable : cuid {
        TemplateId : String(100);
        TemplateDescription: String(100);
        EmployeeExternalId : String(10);
        Date : Date;
        WBSElement : String(5);
        TaskType : String(5);
        RecordedHours : Decimal(4,2);
        RecordedQuantity: Decimal(4,2);
        Day: Int16;
    }
}

