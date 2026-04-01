import Contact from "../models/Contact.js";
import { sendContactNotificationEmail } from "../utils/mailer.js";

// Create new contact
const createContact = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        error: "Name, Email, and Message are required",
      });
    }

    const contact = new Contact({ name, email, message });
    await contact.save();

    await sendContactNotificationEmail(name, email, message);

    res.status(201).json({ success: true, message: "Message sent successfully!", data: contact });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export { createContact };
