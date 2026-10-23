// Match the HTML email input's ASCII address syntax. This checks shape, not
// ownership or delivery; those still require a conversation with the visitor.
const emailPattern = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
const fieldLimits = { name: 120, hospital: 180, department: 200, email: 254, phone: 25 }

export function inquiryContactError(form) {
  if (Object.keys(fieldLimits).some((key) => typeof form?.[key] !== 'string' || !form[key].trim()))
    return 'Please complete each required field.'
  if (Object.entries(fieldLimits).some(([key, limit]) => form[key].length > limit) || typeof form.message !== 'string' || form.message.length > 5000)
    return 'Please shorten your details to fit the displayed field limits.'
  if (!emailPattern.test(form.email)) return 'Please enter a valid email address.'
  if (!/^\+?[-0-9 ().]{7,25}$/.test(form.phone) || form.phone.replace(/\D/g, '').length < 7)
    return 'Please enter a valid phone number, including the country code if needed.'
  return ''
}
