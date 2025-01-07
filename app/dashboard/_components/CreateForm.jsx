
"use client"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { db } from "@/configs"
import { AiChatSession } from "@/configs/AiModel"
import { JsonForms } from "@/configs/schema"
import { useUser } from "@clerk/nextjs"
import { useState } from "react"
import moment from 'moment';
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"


// const PROMPT = ", On the basis of description please give the form in json format with form title, form subheading with form having Form field, formName, placeholder name, and form label, FieldType, field required in Json format"

const PROMPT = `
Based on the description, create a JSON structure for a form. 
The JSON must include:
1. A 'formTitle' key containing a string representing the title of the form.
2. A 'formHeading' key containing a string for the form's heading or subtitle.
3. A 'fields' array where each element represents a form field.

Each field in the 'fields' array must strictly follow this structure:
- 'fieldName' (string): A unique identifier for the field.
- 'fieldTitle' (string): A descriptive title for the field.
- 'placeholder' (string): Placeholder text for the field input.
- 'label' (string): The label displayed for the field.
- 'fieldType' (string): The type of field, such as 'text', 'email', 'number', 'select', 'checkbox', 'radio', or 'textarea'.
- 'required' (boolean): Indicates if the field is mandatory.
- For 'select', 'radio', or 'checkbox' types, include an 'options' array with each option represented as:
  { "value": string, "label": string }.

Example:
{
  "formTitle": "User Registration",
  "formHeading": "Fill out the details below to register",
  "fields": [
    {
      "fieldName": "firstName",
      "fieldTitle": "First Name",
      "placeholder": "Enter your first name",
      "label": "First Name",
      "fieldType": "text",
      "required": true
    },
    {
      "fieldName": "level",
      "fieldTitle": "Swimming Level",
      "placeholder": "Select your swimming level",
      "label": "Swimming Level",
      "fieldType": "select",
      "required": true,
      "options": [
        { "value": "beginner", "label": "Beginner" },
        { "value": "intermediate", "label": "Intermediate" },
        { "value": "advanced", "label": "Advanced" }
      ]
    }
  ]
}

Ensure that:
- All fields are consistently structured.
- All keys are present in every field object.
- For fields with 'options', each option must include 'value' and 'label' (not 'text').

Return only the JSON structure.
`;





const CreateForm = () => {

    const [openDialog, setOpenDialog] = useState(false)
    const [userInput, setUserInput] = useState()
    const [loading, setLoading] = useState()

    const { user } = useUser()
    const route = useRouter()

    const onCreateForm = async () => {
        setLoading(true);

        const result = await AiChatSession.sendMessage("Description:" + userInput + PROMPT);
        let responseText = result.response.text();
        console.log(responseText);

        // Clean and format the response text
        responseText = responseText.replace(/```json|```/g, "").trim();

        // Ensure the response is valid JSON by converting it into a string
        if (responseText) {
            const resp = await db.insert(JsonForms)
                .values({
                    jsonform: responseText,
                    createdBy: user?.primaryEmailAddress?.emailAddress,
                    createdAt: moment().format('DD/MM/yyyy'),
                }).returning({ id: JsonForms.id });

            console.log("New Form ID:", resp[0].id);

            if (resp[0].id) {
                route.push('/edit-form/' + resp[0].id);
            }
        }

        setLoading(false);
    };


    return (
        <div>
            <Button onClick={() => setOpenDialog(true)} variant="sex" >+ Create Form</Button>
            <Dialog open={openDialog}>

                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create new form</DialogTitle>
                        <DialogDescription>
                            <Textarea
                                onChange={(e) => setUserInput(e.target.value)}
                                className="my-2" placeholder="Write a description of your form" />
                            <div className="flex gap-2 my-3 justify-end">
                                <Button
                                    onClick={() => setOpenDialog(false)}
                                    variant="sex">Cancel</Button>
                                <Button
                                    disabled={loading}
                                    onClick={() => onCreateForm()}>
                                    {loading ?
                                        <Loader2 className="animate-spin" /> : 'Create'}

                                </Button>
                            </div>
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </div >
    )
}

export default CreateForm