"use client"
import { db } from "@/configs";
import { JsonForms } from "@/configs/schema";
import { useUser } from "@clerk/nextjs";
import { and, eq } from "drizzle-orm";
import { ArrowLeft, Share2, SquareArrowOutUpRight } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import FormUi from "../_components/FormUI";
import { toast } from "sonner";
import Controller from "../_components/Controller";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { RWebShare } from "react-web-share";

const EditForm = ({ params }) => {
    const { user } = useUser();
    const [jsonForm, setJsonForm] = useState({
        formTitle: "",
        formHeading: "",
        fields: [],
    });

    const router = useRouter();
    const [record, setRecord] = useState(null);
    const [selectedTheme, setSelectedThem] = useState("light");
    const [selectedBackground, setSelectedBackground] = useState();

    // Fetch form data from the database when the component mounts
    useEffect(() => {
        if (user) {
            getFormData();
        }
    }, [user]);

    const getFormData = async () => {
        const result = await db
            .select()
            .from(JsonForms)
            .where(
                and(
                    eq(JsonForms.id, params?.formId),
                    eq(JsonForms.createdBy, user?.primaryEmailAddress?.emailAddress)
                )
            );

        if (result.length > 0) {
            setRecord(result[0]);
            setJsonForm(JSON.parse(result[0].jsonform));
            // Set the selected theme and background from the database
            setSelectedThem(result[0].theme || "light");
            setSelectedBackground(result[0].background || "");
        }
    };

    const onFieldUpdate = async (value, index) => {
        // Update local state
        const updatedFields = [...jsonForm.fields];
        updatedFields[index] = { ...updatedFields[index], ...value };
        setJsonForm((prev) => ({ ...prev, fields: updatedFields }));

        // Update database
        await updateJsonFormInDb({ ...jsonForm, fields: updatedFields });
        toast.success("Field updated!");
    };

    const deleteField = async (indexToRemove) => {
        // Update local state
        const updatedFields = jsonForm.fields.filter((_, index) => index !== indexToRemove);
        setJsonForm((prev) => ({ ...prev, fields: updatedFields }));

        // Update database
        await updateJsonFormInDb({ ...jsonForm, fields: updatedFields });
        toast.success("Field deleted!");
    };

    const updateJsonFormInDb = async (updatedForm) => {
        try {
            const result = await db
                .update(JsonForms)
                .set({ jsonform: updatedForm })
                .where(
                    and(
                        eq(JsonForms.id, record.id),
                        eq(JsonForms.createdBy, user?.primaryEmailAddress?.emailAddress)
                    )
                );

            if (result) {
                console.log("Database updated:", result);
            }
        } catch (error) {
            console.error("Failed to update database:", error);
            toast.error("Failed to update the form.");
        }
    };

    const updateControllerFields = async (value, columnName) => {
        try {
            const result = await db
                .update(JsonForms)
                .set({ [columnName]: value })
                .where(
                    and(
                        eq(JsonForms.id, record.id),
                        eq(JsonForms.createdBy, user?.primaryEmailAddress?.emailAddress)
                    )
                );

            if (result) {
                console.log("Database updated:", result);
                toast.success("Updated");
            }
        } catch (error) {
            console.error("Failed to update database:", error);
            toast.error("Failed to update the form.");
        }
    };

    const handleThemeChange = (value) => {
        setSelectedThem(value);
        // Save the selected theme to the database
        updateControllerFields(value, "theme");
    };

    const handleBackgroundChange = (value) => {
        setSelectedBackground(value);
        // Save the selected background to the database
        updateControllerFields(value, "background");
    };

    return (
        <div className="p-10">
            <div className="flex justify-between items-center ">
                <h2
                    className="flex gap-2 items-center my-5 cursor-pointer hover:font-bold hover:text-indigo-500"
                    onClick={() => router.back()}
                >
                    <ArrowLeft /> Back
                </h2>
                <div className="flex gap-2 mb-5">
                    <Link href={'/aiform/' + record?.id} target="_blank">
                        <Button variant="sex" className="flex gap-2"><SquareArrowOutUpRight className="h-5 w-5" />Live Preview</Button></Link>

                    <RWebShare
                        data={{
                            text: jsonForm?.formHeading + " , Build your form in seconds with AI form Builder",
                            url: process.env.NEXT_PUBLIC_BASE_URL + "/aiform/" + record?.id,
                            title: jsonForm?.formTitle,
                        }}
                        onClick={() => console.log("share clicked")}
                    >
                        <Button className="bg-green-500 hover:bg-green-700"><Share2 className="w-5 h-5" />Share</Button>
                    </RWebShare>

                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-5 border border-indigo-500 rounded-lg shadow-md">
                    <Controller
                        selectedTheme={handleThemeChange}
                        selectedBackground={handleBackgroundChange}
                        currentBackground={selectedBackground}  // Add this line
                        setSignInEnable={(value) => {
                            updateControllerFields(value, "enableSignIn");
                        }}
                    />
                </div>
                <div className="md:col-span-2 border border-indigo-500 rounded-lg p-5 flex items-center justify-center"
                    style={{ backgroundImage: selectedBackground }}
                >
                    <FormUi
                        selectedTheme={selectedTheme}
                        jsonForm={jsonForm}
                        onFieldUpdate={onFieldUpdate}
                        deleteField={(index) => deleteField(index)}
                    />
                </div>
            </div>
        </div>
    );
};

export default EditForm;
