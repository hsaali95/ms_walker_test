import dayjs from "dayjs";
import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string({ required_error: "Please enter email" })
    .min(1, "Email is required")
    .email("Please enter a valid email"),
  password: z
    .string({ required_error: "Please enter password" })
    .min(1, "Password is required"),
});
// export const addSurveySchema = z.object({
//   display_type: z
//     .object({
//       id: z.number(),
//       name: z.string(),
//     })
//     .refine((data) => data.id && data.name, {
//       message: "Please select a valid display type",
//     }),
//   supplier_name: z
//     .object({
//       id: z.number(),
//       name: z.string(),
//     })
//     .refine((data) => data.id && data.name, {
//       message: "Please select a valid supplier name",
//     }),
//   other_supplier: z.string().optional(), // Optional if not always required
//   item_name: z
//     .object({
//       id: z.number(),
//       name: z.string(),
//     })
//     .refine((data) => data.id && data.name, {
//       message: "Please select a valid item name",
//     }),
//   other_item: z.string().optional(), // Optional if not always required
//   notes: z.string().optional(), // Optional if not always required
//   image: z.string().nonempty("Image is required"),
//   number_of_cases: z
//     .string()
//     .nonempty("Number of Cases is required")
//     .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
//       message: "Number of Cases must be a positive number",
//     }),
//   display_coast: z
//     .string()
//     .nonempty("Display Coast is required")
//     .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
//       message: "Display Coast must be a non-negative number",
//     }),
// });

export const addSurveySchema = z.object({
  display_type: z
    .object(
      {
        id: z.number({ required_error: "Display Type ID is required" }),
        display_type: z.string({
          required_error: "Display Type Name is required",
        }),
      },
      { required_error: "Please select display type" }
    )
    .nullable() // Allows the entire object to be null
    .refine(
      (data) => {
        if (data === null) {
          return false;
        }
        return (
          data.id !== null &&
          data.display_type.trim().length > 0 &&
          data.display_type !== null
        );
      },
      {
        message: "Please select a valid display type",
      }
    ),
  supplier_name: z
    .object(
      {
        id: z.number({ required_error: "Supplier ID is required" }),
        vendorFullInfo: z.string({
          required_error: "Supplier Name is required",
        }),
      },
      { required_error: "Please select supplier name" }
    )
    .nullable()
    .refine(
      (data) => {
        if (data === null) {
          return false;
        }
        return (
          data.id !== null &&
          data.vendorFullInfo.trim().length > 0 &&
          data.vendorFullInfo !== null
        );
      },
      {
        message: "Please select supplier name",
      }
    ),
  other_supplier: z.string().nonempty("Other Supplier is required"),
  item_name: z
    .object(
      {
        id: z.number({ required_error: "Item ID is required" }),
        ItemFullInfo: z.string({ required_error: "Item Name is required" }),
      },
      { required_error: "Please select item name" }
    )
    .nullable()
    .refine(
      (data) => {
        if (data === null) {
          return false;
        }
        return (
          data.id !== null &&
          data.ItemFullInfo.trim().length > 0 &&
          data.ItemFullInfo !== null
        );
      },
      {
        message: "Please select item name",
      }
    ),
  other_item: z.string().nonempty("Other Item is required"),
  notes: z.string().nonempty("Notes are required"),
  image: z
    .string({ required_error: "Image is required" })
    .min(3, "Image is required"),
  number_of_cases: z
    .string()
    .nonempty("Number of Cases is required")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Number of Cases must be a positive number",
    }),
  display_coast: z
    .string()
    .nonempty("Display Coast is required")
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
      message: "Display Coast must be a non-negative number",
    }),
});

export const registerUserSchema = z
  .object({
    username: z
      .string({ required_error: "Please enter name" })
      .min(3, "Name must be at least 3 characters long")
      .regex(/^[A-Za-z ]+$/, "Name must contain only letters and spaces")
      .trim(),

    image: z
      .string({ required_error: "Image is required" })
      .min(3, "Image is required"),

    email: z
      .string({ required_error: "Please enter email" })
      .min(1, "Email is required")
      .email("Please enter a valid email"),

    password: z
      .string({ required_error: "Please enter password" })
      .min(8, "Password must be at least 8 characters long")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[@$!%*?&]/,
        "Password must contain at least one special character (@, $, !, %, *, ?, &)"
      ),

    confirmPassword: z
      .string({ required_error: "Please confirm your password" })
      .min(1, "Confirmation is required"),

    name: z
      .object(
        {
          id: z
            .number()
            .min(1, "Please select a valid ID")
            .refine((val) => val !== null, { message: "role cannot be null" }), // Ensures ID is not null
          name: z
            .string()
            .min(1, "Role is required") // Ensures the error appears when empty
            .refine((val) => val !== null && val.trim().length > 0, {
              // Ensures Name is not null or empty
              message: "Please provide a valid role",
            }),
        },
        { required_error: "Role is required" }
      )
      .strict()
      .nullable() // Allows the entire object to be null
      .refine(
        (data) => {
          if (data === null) {
            return false; // Will trigger error when the object is null
          }
          return (
            data.id !== null &&
            data.name !== null &&
            data.name.trim().length > 0
          );
        },
        {
          message: "Role is required", // Error message for null object
          path: [], // Error path for the entire object
        }
      ), // Prevents empty object {}
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"], // Point to confirmPassword for error handling
  });

export const addGroupSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name cannot exceed 100 characters"),
  access_type: z
    .object(
      {
        id: z.number(),
        name: z.string({ required_error: "Access type is required" }),
      },
      { required_error: "Please select access type" }
    )
    .nullable()
    .refine(
      (data) => {
        if (data === null) {
          return false;
        }
        return (
          data.id !== null && data.name.trim().length > 0 && data.name !== null
        );
      },
      {
        message: "Please select access type",
      }
    ),
  is_active: z
    .union([z.boolean(), z.string()])
    .transform((val) => val === true || val === "true")
    .refine((val) => val === true || val === false, {
      message: "Active status is required",
    }),
  email: z
    .object(
      {
        id: z.number(),
        email: z.string({
          required_error: "At least one user must be selected",
        }),
      },
      {
        required_error: "Please select users",
      }
    )
    .nullable()
    .refine(
      (data) => {
        if (data === null) {
          return false;
        }
        return (
          data.id !== null &&
          data.email.trim().length > 0 &&
          data.email !== null
        );
      },
      {
        message: "Please select users",
      }
    ),
});
export const addTeamSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name cannot exceed 100 characters"),

  is_active: z
    .union([z.boolean(), z.string()])
    .transform((val) => val === true || val === "true")
    .refine((val) => val === true || val === false, {
      message: "Active status is required",
    }),
  email: z
    .object(
      {
        id: z.number(),
        email: z.string({
          required_error: "At least one user must be selected",
        }),
      },
      {
        required_error: "Please select users",
      }
    )
    .nullable()
    .refine(
      (data) => {
        if (data === null) {
          return false;
        }
        return (
          data.id !== null &&
          data.email.trim().length > 0 &&
          data.email !== null
        );
      },
      {
        message: "Please select users",
      }
    ),
  manager: z
    .object(
      {
        id: z.number(),
        email: z.string({
          required_error: "Please select manager",
        }),
      },
      { required_error: "Please select manager" }
    )
    .nullable()
    .refine(
      (data) => {
        if (data === null) {
          return false;
        }
        return (
          data.id !== null &&
          data.email.trim().length > 0 &&
          data.email !== null
        );
      },
      {
        message: "Please select users",
      }
    ),
});

// export const activitySchema = z.object({
//   notes: z
//     .string()
//     .min(1, "Notes are required")
//     .max(500, "Notes cannot exceed 500 characters"),
//   activity_log: z
//     .string()
//     .min(1, "Activity log is required")
//     .max(1000, "Activity log cannot exceed 1000 characters"),
//   city: z.string().min(1, "City must be at least 1 character long").optional(),
//   merch_rep_id: z
//     .string()
//     .min(1, "Merch rep id be at least 1 character long")
//     .optional(),
//   account_name: z
//     .object(
//       {
//         id: z.number({ required_error: "Account ID is required" }),
//         fullCustomerInfo: z.string({
//           required_error: "Account Name is required",
//         }),
//       },
//       {
//         required_error: "Please select account name",
//       }
//     )
//     .nullable()
//     .refine(
//       (data) => {
//         if (data === null) {
//           return false;
//         }
//         return (
//           data.id !== null &&
//           data.fullCustomerInfo.trim().length > 0 &&
//           data.fullCustomerInfo !== null
//         );
//       },
//       {
//         message: "Please select users",
//       }
//     ),
//   start_time: z
//     .string({ required_error: "Please select start time" })
//     .nonempty("Start time is required")
//     .refine((value) => dayjs(value, "YYYY-MM-DDTHH:mm:ss", true).isValid(), {
//       message: "Start time must be a valid date-time format",
//     }),
//   end_time: z
//     .string({ required_error: "Please select end time" })

//     .nonempty("End time is required")
//     .refine((value) => dayjs(value, "YYYY-MM-DDTHH:mm:ss", true).isValid(), {
//       message: "End time must be a valid date-time format",
//     }),
//   is_complete: z
//     .union([z.boolean(), z.string()])
//     .transform((val) => val === true || val === "true")
//     .refine((val) => val === true || val === false, {
//       message: "Active status is required",
//     }),
// });

// export const activitySchema = z.object({
//   notes: z
//     .string()
//     .min(1, "Notes are required")
//     .max(500, "Notes cannot exceed 500 characters"),
//   activity_log: z
//     .string()
//     .min(1, "Activity log is required")
//     .max(1000, "Activity log cannot exceed 1000 characters"),
//   city: z.string().min(1, "City must be at least 1 character long").optional(),
//   merch_rep_id: z
//     .string()
//     .min(1, "Merch rep id be at least 1 character long")
//     .optional(),
//   account_name: z
//     .object(
//       {
//         id: z.number({ required_error: "Account ID is required" }),
//         fullCustomerInfo: z.string({
//           required_error: "Account Name is required",
//         }),
//       },
//       {
//         required_error: "Please select account name",
//       }
//     )
//     .nullable()
//     .refine(
//       (data) => {
//         if (data === null) {
//           return false;
//         }
//         return (
//           data.id !== null &&
//           data.fullCustomerInfo.trim().length > 0 &&
//           data.fullCustomerInfo !== null
//         );
//       },
//       {
//         message: "Please select users",
//       }
//     ),
//   start_time: z
//     .string({ required_error: "Please select start time" })
//     .nonempty("Start time is required")
//     .refine((value) => dayjs(value, "YYYY-MM-DDTHH:mm:ss", true).isValid(), {
//       message: "Start time must be a valid date-time format",
//     })
//     .refine((value, ctx) => {
//       const start = dayjs(value);
//       const end = dayjs(ctx.parent?.end_time); // Fix here to access end_time
//       if (start.isAfter(end)) {
//         return false;
//       }
//       return true;
//     }, {
//       message: "Start time cannot be later than end time",
//     }),
//   end_time: z
//     .string({ required_error: "Please select end time" })
//     .nonempty("End time is required")
//     .refine((value) => dayjs(value, "YYYY-MM-DDTHH:mm:ss", true).isValid(), {
//       message: "End time must be a valid date-time format",
//     })
//     .refine((value, ctx) => {
//       const end = dayjs(value);
//       const start = dayjs(ctx.parent?.start_time); // Fix here to access start_time
//       if (end.diff(start, "minute") < 5) {
//         return false;
//       }
//       return true;
//     }, {
//       message: "End time must be at least 5 minutes after start time",
//     }),
//   is_complete: z
//     .union([z.boolean(), z.string()])
//     .transform((val) => val === true || val === "true")
//     .refine((val) => val === true || val === false, {
//       message: "Active status is required",
//     }),
// });

// Define the type of the parent schema

export const activitySchema = z
  .object({
    notes: z
      .string()
      .min(1, "Notes are required")
      .max(500, "Notes cannot exceed 500 characters"),

    activity_log: z
      .string()
      .min(1, "Activity log is required")
      .max(1000, "Activity log cannot exceed 1000 characters"),

    city: z
      .string()
      .min(1, "City must be at least 1 character long")
      .optional(),

    merch_rep_id: z
      .string()
      .min(1, "Merch rep id must be at least 1 character long")
      .optional(),

    account_name: z
      .object(
        {
          id: z.number({ required_error: "Account ID is required" }),
          fullCustomerInfo: z.string({
            required_error: "Account Name is required",
          }),
        },
        {
          required_error: "Please select account name",
        }
      )
      .nullable()
      .refine(
        (data) => {
          if (data === null) {
            return false;
          }
          return (
            data.id !== null &&
            data.fullCustomerInfo.trim().length > 0 &&
            data.fullCustomerInfo !== null
          );
        },
        {
          message: "Please select users",
        }
      ),

    start_time: z
      .string({ required_error: "Please select start time" })
      .nonempty("Start time is required")
      .refine((value) => dayjs(value, "YYYY-MM-DDTHH:mm:ss", true).isValid(), {
        message: "Start time must be a valid date-time format",
      }),

    end_time: z
      .string({ required_error: "Please select end time" })
      .nonempty("End time is required")
      .refine((value) => dayjs(value, "YYYY-MM-DDTHH:mm:ss", true).isValid(), {
        message: "End time must be a valid date-time format",
      }),

    is_complete: z
      .union([z.boolean(), z.string()])
      .transform((val) => val === true || val === "true")
      .refine((val) => val === true || val === false, {
        message: "Active status is required",
      }),
  })
  .superRefine((data, ctx) => {
    const start = dayjs(data.start_time);
    const end = dayjs(data.end_time);

    // Ensure start time is before end time
    if (start.isAfter(end)) {
      ctx.addIssue?.({
        path: ["start_time"],
        message: "Start time cannot be after end time",
        code: "custom",
      });
    }

    // Ensure end time is at least 5 minutes after start time
    if (end.diff(start, "minute") < 5) {
      ctx.addIssue?.({
        path: ["end_time"],
        message: "End time must be at least 5 minutes after start time",
        code: "custom",
      });
    }
  });

export const resetPasswordSchema = z
  .object({
    password: z
      .string({ required_error: "Please enter password" })
      .min(8, "Password must be at least 8 characters long")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[@$!%*?&]/,
        "Password must contain at least one special character (@, $, !, %, *, ?, &)"
      ),

    confirmPassword: z
      .string({ required_error: "Please confirm your password" })
      .min(1, "Confirmation is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"], // Point to confirmPassword for error handling
  });
