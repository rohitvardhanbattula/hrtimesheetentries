using {db.master as d} from '../db/schema';

type TemplateEntry {
    TemplateId       : String(100);
    TemplateDescription : String(100);
    EmployeeExternalId : String(10);
    Date             : Date;
    WBSElement       : String(5);
    TaskType         : String(5);
    RecordedHours    : Decimal(4,2);
    RecordedQuantity: Decimal(4,2);
    Day : Int16;
}
type MyTemplate
{
    TemplateId       : String(100);
    TemplateDescription : String(100);
}

service MyService {
    
    entity Templates @(restrict:[

        {
            grant : ['VIEW'],
            to :'Viewer'
        },
        {
            grant : ['EDIT'],
            to :'Editor'
        }
    ])
    
    
     as projection on d.TemplateTable;

    action SaveTemplate(entries : array of TemplateEntry) returns String;

    function GetAllTemplateIds() returns array of MyTemplate;

    action GetTemplateData(TemplateId: String) returns array of Templates;
}
