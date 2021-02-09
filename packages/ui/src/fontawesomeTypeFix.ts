import { FontAwesomeIcon as FontAwesomeIconBadType, FontAwesomeIconProps } from '@fortawesome/vue-fontawesome'
import { DefineComponent } from 'vue'

const FontAwesomeIconTyped : DefineComponent<FontAwesomeIconProps> = FontAwesomeIconBadType as any
export const FontAwesomeIcon = FontAwesomeIconTyped