import type { FieldHook } from 'payload'

const format = (val: string): string =>
  val
    .toLowerCase()
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .replace(/[àáạảãâầấậẩẫăằắặẳẵ]/g, 'a')
    .replace(/[èéẹẻẽêềếệểễ]/g, 'e')
    .replace(/[ìíịỉĩ]/g, 'i')
    .replace(/[òóọỏõôồốộổỗơờớợởỡ]/g, 'o')
    .replace(/[ùúụủũưừứựửữ]/g, 'u')
    .replace(/[ỳýỵỷỹ]/g, 'y')
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .trim()

export const formatSlug =
  (fallbackField: string): FieldHook =>
  ({ operation, value, data }) => {
    if (typeof value === 'string' && value.length > 0) {
      return format(value)
    }

    if (operation === 'create') {
      const fallbackValue = data?.[fallbackField]
      if (typeof fallbackValue === 'string' && fallbackValue.length > 0) {
        return format(fallbackValue)
      }
    }

    return value
  }
