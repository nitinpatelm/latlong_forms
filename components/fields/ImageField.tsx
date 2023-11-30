"use client";

import {
  ElementsType,
  FormElement,
  FormElementInstance,
  SubmitFunction,
} from "../FormElements";
import { Label } from "../ui/label";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import useDesigner from "../hooks/useDesigner";
import axios from 'axios';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { MdLocationPin } from "react-icons/md";
import { Switch } from "../ui/switch";
import { Input } from "../ui/input";
import { BiCamera } from "react-icons/bi";
import { LuSwitchCamera } from "react-icons/lu";
import { cn } from "@/lib/utils";
import { ImSpinner3 } from "react-icons/im";

const type: ElementsType = "Image";

const extraAttributes = {
  required: true, // px
  label: "Image",
};

const propertiesSchema = z.object({
  required: z.boolean().default(false),
  label: z.string().min(2)
});

export const ImageFieldElement: FormElement = {
  type,
  construct: (id: string) => ({
    id,
    type,
    extraAttributes,
  }),
  designerBtnElement: {
    icon: BiCamera,
    label: "Image",
  },
  designerComponent: DesignerComponent,
  formComponent: FormComponent,
  propertiesComponent: PropertiesComponent,
  validate: (formElement: FormElementInstance, currentValue: string): boolean => {
    const element = formElement as CustomInstance;
    if (element.extraAttributes.required) {
      return currentValue.length > 3;
    }
    return true;
  },
};

type CustomInstance = FormElementInstance & {
  extraAttributes: typeof extraAttributes;
};

function DesignerComponent({
  elementInstance,
}: {
  elementInstance: FormElementInstance;
}) {
  const element = elementInstance as CustomInstance;
  const { height } = element.extraAttributes;
  return (
    <div className="flex flex-col gap-2 w-full items-center">
      <Label className="text-muted-foreground">
        Image: This will request user for image capture or upload
      </Label>
      <BiCamera className="h-8 w-8" />
    </div>
  );
}

function FormComponent({
  elementInstance,
  submitValue,
  isInvalid,
  defaultValue,
}: {
  elementInstance: FormElementInstance;
  submitValue?: SubmitFunction;
  isInvalid?: boolean;
  defaultValue?: string;
}) {
  const element = elementInstance as CustomInstance;
  const { required, label } = element.extraAttributes;
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadedImagePath, setUploadedImagePath] = useState<string | null >(null);

  useEffect(() => {
    setError(isInvalid === true);
  }, [isInvalid]);


  const [imageURL, setImageURL] = useState(null);

  const convertToPng = async (imageDataUrl: any) => {
    const image = new Image();
    image.src = imageDataUrl;
    return new Promise((resolve) => {
      image.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = image.width;
        canvas.height = image.height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(image, 0, 0, image.width, image.height);
        canvas.toBlob((blob: any) => {
          const reader = new FileReader();
          reader.readAsDataURL(blob);
          reader.onloadend = () => {
            resolve(reader.result);
          };
        }, "image/png");
      };
    });
  };

  const handleImageChange = async (e: any) => {
    setLoading(true);
    try {
      const selectedImage = e.target.files[0];
      if (!selectedImage) return;
      const imageURL = URL.createObjectURL(selectedImage);
      const imageAsPng = await convertToPng(imageURL);
      axios.post('https://latlong-demo-tool-api.latlong.in/demo/upload_image', {
        base64: imageAsPng,
        image_name: Date.now().toString()
      }).then(res => {
        setUploadedImagePath(res.data.image_path)
        setLoading(false)
        if (!submitValue) return;
        const valid = ImageFieldElement.validate(element, uploadedImagePath ? uploadedImagePath : '');
        setError(!valid);
        if (!valid) return;
        submitValue(element.id, uploadedImagePath ? uploadedImagePath : '');
      }).catch(err => {
        setLoading(false)
      })
    } catch (error) {
        console.log(error)
    }
  };

  const handleRetake = () => {
    setImageURL(null);
  };

  return (
    <>
    <input
        accept="image/*"
        id="icon-button-file"
        type="file"
        capture="environment"
        className="hidden h-40 w-40"
        onChange={handleImageChange}
    />
    <Label className={cn(error && "text-red-500")}>
      {label}
      {required && "*"}
    </Label>
    <div className="w-40 max-w-40">
    <label htmlFor="icon-button-file">
    <div className="max-w-40 w-40 h-40 rounded overflow-hidden shadow-lg border-2 border-indigo-600">
      {loading &&
        <div className="absolute inset-0 flex items-center justify-center bg-gray-300 bg-opacity-50">
        {/* Add your loading spinner or any loading indicator here */}
          <ImSpinner3 />
        </div>
      }
      {!loading &&
        <div
          className="w-40 h-40  flex items-center justify-center"
          style={{ color: "#4381c3" }}
        >
          {uploadedImagePath ? (
            <>
              <div>
                <img src={uploadedImagePath} alt="Captured" />
              </div>
            </>
          ) : (
            <BiCamera size={80} />
          )}
        </div>
      }

    </div>
  </label>


  </div>
  </>
  );
}

type propertiesFormSchemaType = z.infer<typeof propertiesSchema>;

function PropertiesComponent({
  elementInstance,
}: {
  elementInstance: FormElementInstance;
}) {
  const element = elementInstance as CustomInstance;
  const { updateElement } = useDesigner();
  const form = useForm<propertiesFormSchemaType>({
    resolver: zodResolver(propertiesSchema),
    mode: "onBlur",
    defaultValues: {
      required: element.extraAttributes.required,
    },
  });

  useEffect(() => {
    form.reset(element.extraAttributes);
  }, [element, form]);

  function applyChanges(values: propertiesFormSchemaType) {
    const { required, label } = values;
    updateElement(element.id, {
      ...element,
      extraAttributes: {
        required,
        label
      },
    });
  }

  return (
    <Form {...form}>
      <form
        onBlur={form.handleSubmit(applyChanges)}
        onSubmit={(e) => {
          e.preventDefault();
        }}
        className="space-y-3"
      >
        <FormField
          control={form.control}
          name="label"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Label</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") e.currentTarget.blur();
                  }}
                />
              </FormControl>
              <FormDescription>
                The label of the field. <br /> It will be displayed above the field
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="required"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <FormLabel>Required</FormLabel>
                <FormDescription>
                  The helper text of the field. <br />
                  It will be displayed below the field.
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
