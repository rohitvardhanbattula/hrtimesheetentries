const cds = require('@sap/cds');

module.exports = (srv) => {

    srv.on('SaveTemplate', async (req) => {
        const { entries } = req.data;
        if (!entries || !Array.isArray(entries)) {
            return req.error(400, "Invalid data format.");
        }
    
        try {
            const result = await cds.transaction(req).run(
                INSERT.into('db.master.TemplateTable').entries(entries)
            );
            console.log("Inserted records:", result);
            return { message: "Template saved successfully!" };
        } catch (error) {
            console.error("Error inserting records:", error);
            return req.error(500, "Database insertion failed.");
        }
    });

    srv.on('GetAllTemplateIds', async (req) => {
        const result = await cds.transaction(req).run(
            SELECT.distinct('TemplateId').from('db.master.TemplateTable')
        );
        return result.map(row => row.TemplateId);
    });

    srv.on('GetTemplateData', async (req) => {
        const { TemplateId } = req.data;
        if (!TemplateId) return req.error(400, "TemplateId is required.");

        const result = await cds.transaction(req).run(
            SELECT.from('db.master.TemplateTable').where({ TemplateId })
        );
        return result;
    });
    
};
