import { Button } from '@/components/ui/button';
import { db } from '@/configs';
import { userResponses } from '@/configs/schema';
import { eq, count, sql } from 'drizzle-orm';
import { Loader2 } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { toast } from 'sonner';

function FormListItemResponse({ jsonForm, formRecord }) {
    const [loading, setLoading] = useState(false);
    const [responseCount, setResponseCount] = useState(0);

    useEffect(() => {
        const fetchResponseCount = async () => {
            try {
                const result = await db
                    .select({
                        formId: userResponses.formRef,
                        totalResponses: sql`COUNT(*)`.as('totalResponses')
                    })
                    .from(userResponses)
                    .where(eq(userResponses.formRef, formRecord.id))
                    .groupBy(userResponses.formRef);

                if (result.length > 0) {
                    setResponseCount(result[0].totalResponses);
                } else {
                    setResponseCount(0); // No responses for this form
                }
            } catch (error) {
                console.error('Error fetching response count:', error);
                setResponseCount(0);
            }
        };

        fetchResponseCount();
    }, [formRecord.id]);

    const exportToExcel = async () => {
        try {
            setLoading(true);

            // Fetch responses
            const result = await db
                .select()
                .from(userResponses)
                .where(eq(userResponses.formRef, formRecord.id));

            if (!result || result.length === 0) {
                toast.error('No responses to export');
                return;
            }

            // Process the responses
            const processedData = result
                .map(item => {
                    try {
                        return JSON.parse(item.jsonResponse);
                    } catch (err) {
                        console.error('Error parsing response:', err);
                        return null;
                    }
                })
                .filter(item => item !== null);

            if (processedData.length === 0) {
                toast.error('No valid responses to export');
                return;
            }

            // Create and download Excel file
            const worksheet = XLSX.utils.json_to_sheet(processedData);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Responses');

            // Generate filename
            const filename = `${jsonForm?.formTitle || 'Form_Responses'}_${new Date().toISOString().split('T')[0]}.xlsx`;

            XLSX.writeFile(workbook, filename);
            toast.success('Data exported successfully');
        } catch (error) {
            console.error('Export error:', error);
            toast.error('Failed to export data');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="border shadow-sm rounded-lg p-4 my-5 gradient-background10">
            <h2 className="text-lg text-white">{jsonForm?.formTitle}</h2>
            <h2 className="text-indigo-500 text-sm">{jsonForm?.formHeading}</h2>
            <hr className="my-4" />
            <div className="flex justify-between items-center">
                <h2 className="text-white text-sm">
                    <strong>{responseCount}</strong> Responses
                </h2>
                <Button
                    disabled={loading}
                    onClick={exportToExcel}
                    className=""
                    size="sm"
                >
                    {loading ? <Loader2 className="animate-spin" /> : 'Export'}
                </Button>
            </div>
        </div>
    );
}

export default FormListItemResponse;
