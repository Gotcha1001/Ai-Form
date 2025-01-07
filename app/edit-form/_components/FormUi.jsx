import FeatureMotionWrapperMap from '@/components/FramerMotion/FeatureMotionWrapperMap'
import { Input } from '@/components/ui/input'
import React, { useRef, useState } from 'react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import FieldEdit from './FieldEdit'
import { db } from '@/configs'
import { userResponses } from '@/configs/schema'
import moment from 'moment'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { SignIn, SignInButton, useUser } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'



function FormUi({ jsonForm, onFieldUpdate, deleteField, selectedTheme, selectedBackground, editable = true, formId = 0, enabledSignIn = false }) {
    // Add this to ensure client-side only rendering for the button
    const [isClient, setIsClient] = React.useState(false)
    const [formData, setFormData] = useState({})
    let formRef = useRef()
    const router = useRouter();

    const { user, isSignedIn } = useUser()

    React.useEffect(() => {
        setIsClient(true)
    }, [])


    const handleInputChange = (event) => {

        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value
        })
    }

    const onFormSubmit = async (event) => {
        event.preventDefault()
        console.log(formData)
        const result = await db.insert(userResponses).values({
            jsonResponse: formData,
            createdAt: moment().format('DD/MM/yyyy'),
            formRef: formId
        })
        if (result) {
            formRef.reset()
            toast.success('Form submitted successfully')
            router.push('/dashboard'); // Redirect to the dashboard
        }
        else {
            toast.error('Error submitting form')
        }
    }

    const handleSelectChange = (label, value) => {
        setFormData({
            ...formData,
            [label]: value
        })
    }

    const handleCheckboxChange = (fieldName, itemName, value) => {
        const list = formData?.[fieldName] ? formData?.[fieldName] : [];

        if (value) {
            list.push({
                label: itemName,
                value: value
            })
            setFormData({
                ...formData,
                [fieldName]: list
            })
        } else {
            const result = list.filter((item) => item.label !== itemName)
            setFormData({
                ...formData,
                [fieldName]: result
            })
        }
    }
    return (
        <form
            ref={(e) => formRef = e}
            onSubmit={onFormSubmit}
            className='border rounded-lg border-purple-600 p-5 w-full max-w-[600px]' data-theme={selectedTheme}>
            <h2 className='gradient-title font-bold text-center text-3xl'>{jsonForm?.formTitle}</h2>
            <h2 className='text-sm text-gray-500 text-center'>{jsonForm?.formHeading}</h2>

            {jsonForm?.fields.map((field, index) => (
                <FeatureMotionWrapperMap key={index} index={index}>
                    <div className='flex items-center gap-2'>
                        {field.fieldType === 'select' ? (
                            <div className='my-3 w-full'>
                                <label className='text-sm text-indigo-500'>{field.label}</label>
                                <Select
                                    onValueChange={(v) => handleSelectChange(field.fieldName, v)}
                                    required={field?.required}
                                >
                                    <SelectTrigger className="w-full bg-transparent text-black">
                                        <SelectValue placeholder={field.placeholder} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {field?.options?.map((item, index) => (
                                            <SelectItem key={index} value={item.value}>
                                                {item.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        ) : field.fieldType === 'radio' ? (
                            <div className='w-full'>
                                <label className='text-sm text-indigo-500'>{field.label}</label>
                                <RadioGroup
                                    onValueChange={(value) => handleSelectChange(field.fieldName, value)}
                                    name={field.fieldName}
                                    required={field?.required}
                                >
                                    {field.options.map((item, index) => (
                                        <div key={index} className="flex items-center space-x-2">
                                            <RadioGroupItem value={item.value || item.label} id={`${field.fieldName}-${index}`} />
                                            <Label htmlFor={`${field.fieldName}-${index}`}>{item.label}</Label>
                                        </div>
                                    ))}
                                </RadioGroup>
                            </div>
                        ) : field.fieldType === 'checkbox' ? (
                            <div className='my-3 w-full'>
                                <label className='text-sm text-indigo-500'>{field.label}</label>
                                {field?.options?.map((item, index) => (
                                    <div key={index} className='flex gap-2 items-center'>
                                        <Checkbox
                                            onCheckedChange={(v) => handleCheckboxChange(field?.label, item.label, v)}

                                            value={item.value} />

                                        <h2>{item.label}</h2>
                                    </div>
                                ))}
                            </div>
                        ) : field.fieldType === 'textarea' ? (
                            <div className="my-3 w-full">
                                <label className="text-sm text-indigo-500">{field.label}</label>
                                <Textarea
                                    placeholder={field.placeholder}
                                    name={field.fieldName}
                                    required={field?.required}
                                    onChange={handleInputChange}
                                />
                            </div>
                        ) : field.fieldType === 'number' ? (
                            <div className="my-3 w-full">
                                <label className="text-sm text-indigo-500">{field.label}</label>
                                <Input
                                    type="number"
                                    placeholder={field.placeholder}
                                    name={field.fieldName}
                                    onChange={handleInputChange}
                                    required={field?.required}
                                />
                            </div>
                        ) : field.fieldType === 'date' ? (
                            <div className="my-3 w-full">
                                <label className="text-sm text-indigo-500">{field.label}</label>
                                <Input
                                    type="date"
                                    placeholder={field.placeholder}
                                    name={field.fieldName}
                                    onChange={handleInputChange}
                                    required={field?.required}
                                />
                            </div>
                        ) : field.fieldType === 'tel' ? (
                            <div className="my-3 w-full">
                                <label className="text-sm text-indigo-500">{field.label}</label>
                                <Input
                                    type="tel"
                                    placeholder={field.placeholder}
                                    name={field.fieldName}
                                    onChange={handleInputChange}
                                    required={field?.required}
                                />
                            </div>
                        ) : (
                            <div className="my-3 w-full">
                                <label className="text-sm text-indigo-500">{field.label}</label>
                                <Input
                                    type="text"
                                    placeholder={field.placeholder}
                                    name={field.fieldName}
                                    onChange={handleInputChange}
                                    required={field?.required}
                                />
                            </div>
                        )}
                        {editable && (
                            <div>
                                <FieldEdit
                                    deleteField={() => deleteField(index)}
                                    onUpdate={(value) => onFieldUpdate(value, index)}
                                    defaultValue={field}
                                />
                            </div>
                        )}

                    </div>
                </FeatureMotionWrapperMap>
            ))}

            {!enabledSignIn ? (
                isSignedIn ? (
                    isClient ? (
                        !editable ? (
                            <button type="submit" className="btn btn-primary w-full">
                                Submit
                            </button>
                        ) : null
                    ) : null
                ) : (
                    <SignInButton mode="modal">
                        Sign In Before Submitting
                    </SignInButton>
                )
            ) : null}




        </form>
    )
}

export default FormUi