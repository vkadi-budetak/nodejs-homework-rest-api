// const fs = require('fs/promises')

const path = require("path");
const uuid = require("uuid").v4;
const fs = require("fs").promises;

const contactsPath = path.join(__dirname, "/contacts.json");

const listContacts = async () => {
  try {
    const data = await fs.readFile(contactsPath, "utf-8");
    const contacts = JSON.parse(data);
    return contacts;
  } catch (error) {
    console.log(error.message);
    throw error;
  }
};

const getContactById = async (contactId) => {
  try {
    const contacts = await listContacts();
    const contact = contacts.find((contact) => contact.id === contactId);

    if (!contact) {
      const error = new Error(`Contact with ID ${contactId} not found`);
      error.status = 404;
      throw error;
    }
    return contact;
  } catch (error) {
    console.log(error.message);
    throw error;
  }
};

const removeContact = async (contactId) => {
  try {
    const contacts = await listContacts();

    const index = contacts.findIndex((contact) => contact.id === contactId);

    if (index !== -1) {
      contacts.splice(index, 1);

      const updatedData = JSON.stringify(contacts, null, 2);
      await fs.writeFile(contactsPath, updatedData, "utf-8");

      return { message: "Contact deleted" };
    } else {
      const error = new Error("Not found");
      error.status = 404;
      throw error;
    }
  } catch (error) {
    console.log(error.message);
    throw error;
  }
};

const addContact = async (body) => {
  try {
    const contacts = await listContacts();

    const requiredFields = ["name", "email", "phone"];
    for (const field of requiredFields) {
      if (!body[field]) {
        const error = new Error(`missing required name: ${field}`);
        error.status = 400;
        throw error;
      }
    }

    const contactId = uuid();

    const newContact = {
      id: contactId,
      name: body.name,
      email: body.email,
      phone: body.phone,
    };

    contacts.push(newContact);
    await fs.writeFile(
      contactsPath,
      JSON.stringify(contacts, null, 2),
      "utf-8"
    );
    return newContact;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const updateContact = async (contactId, body) => {
  try {
    if (!body || Object.keys(body).length === 0) {
      const error = new Error("Missing fields");
      error.status = 400;
      throw error;
    }
    const contacts = await listContacts();

    const contactIndex = contacts.findIndex(
      (contact) => contact.id === contactId
    );

    if (contactIndex === -1) {
      const error = new Error("Not found");
      error.status = 404;
      throw error;
    }

    const updatedContact = { ...contacts[contactIndex], ...body };
    contacts[contactIndex] = updatedContact;

    await fs.writeFile(
      contactsPath,
      JSON.stringify(contacts, null, 2),
      "utf-8"
    );

    return updatedContact;
  } catch (error) {
    console.log(error.message);
    throw error;
  }
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
