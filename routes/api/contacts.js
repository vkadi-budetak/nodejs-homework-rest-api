const express = require("express");

const router = express.Router();

const {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
} = require("../../models/contacts");

const contactSchema = require("../../models/schema");

router.get("/", async (req, res, next) => {
  try {
    const contacts = await listContacts();
    res.status(200).json(contacts);
  } catch (error) {
    next(error);
  }
});

router.get("/:contactId", async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const contact = await getContactById(contactId);
    res.status(200).json(contact);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    // const requiredFields = ["name", "email", "phone"];


    // for (const field of requiredFields) {
    //   if (!req.body[field]) {
    //     const error = new Error(`missing required name: ${field}`);
    //     error.status = 400;
    //     throw error;
    //   }
    // }

    const { error } = contactSchema.validate(req.body);
    if (error) {
      const validationError = new Error(error.details[0].message);
      validationError.status = 400;
      throw validationError;
    }

    const newContact = await addContact(req.body);
    res.status(201).json(newContact);
  } catch (error) {
    next(error);
  }
});

router.delete("/:contactId", async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const result = await removeContact(contactId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

router.put("/:contactId", async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const { body } = req;

    const { error } = contactSchema.validate(body);
    if (error) {
      const validationError = new Error(error.details[0].message);
      validationError.status = 400;
      throw validationError;
    }

    const updatedContact = await updateContact(contactId, body);

    res.status(200).json(updatedContact);
  } catch (error) {
    if (error.status === 404) {
      res.status(404).json({ message: "Not found" });
      return;
    }
    next(error);
  }
});

module.exports = router;