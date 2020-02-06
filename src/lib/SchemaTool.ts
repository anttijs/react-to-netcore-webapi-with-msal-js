
interface EnumDesc {
    value: number;
    text: string;
}
export interface Prop {
    Hidden: string|null;
    Name: string;
    Title: string|null;
    Type: string|null;
    InputType: string;
    Readonly: boolean;
    Required: boolean;
    Min: any|null;
    Max: any|null;
    MinLength: number|null;
    MaxLength: number|null;
    Pattern: string|null;
    PropEnums: EnumDesc[];

}
export interface Schema {
    Display: string|null;
    ClassName: string|null;
    KeyName: string|null;
    Props: Prop[]
}
interface SchemaTool {
    schema: Schema | null;
    editFields(): Prop[];
    label(prop: Prop): string;
    labelForCheckBox(prop: Prop): string;
    invalidFeedback(prop: Prop, dto: any): string;
    state(prop: Prop, dto: any): boolean;
    isValidState(dto: any): boolean
    isNumeric(prop: Prop): boolean


}
const schemaTool: SchemaTool =
{
  schema:  null,
  editFields() {
    if (!this.schema)
        return []
    return this.schema.Props.filter( ({ Hidden }) => { return !Hidden })
  },
  label(prop) {
    if (prop.Type === 'bool')
      return ''
    else if (prop.Title === null)
      return prop.Name!
    else
      return prop.Title
  },
  labelForCheckBox(prop) {
    if (prop.Type !== 'bool')
      return ''
    if (prop.Title === null)
      return prop.Name!
    return prop.Title
  },
  invalidFeedback(prop, dto) {
    if (this.state(prop, dto)===true){
      return ''
    }
    if (prop.Required === true && (dto === null || dto === undefined || dto.length===0))
      return 'The field is required';
    if (prop.Required === true && prop.Type === 'enum' && prop.PropEnums.find( ({value}) => value === dto) === undefined)
      return 'The field is required'
    if (prop.Type === 'number') {
      if ((prop.Max !== null && (dto === null || dto === undefined || dto > prop.Max)) || 
        (prop.Min !== null && (dto === null ||  dto === undefined || dto < prop.Min))) {
        return `Enter value between ${prop.Min} and ${prop.Max}`
      }
      if(isNaN(dto)) {
        return 'Enter a valid number'
      }
    }
    if (prop.Type === 'text') { 
      if ((prop.MaxLength !== null && (dto === null ||  dto === undefined || dto.length > prop.MaxLength!)) || 
        (prop.MinLength !== null && (dto === null ||  dto === undefined || dto.length < prop.MinLength!))) {
        return `Text should contain between ${prop.MinLength} and ${prop.MaxLength} characters`
      }
    }
    return ''
  },
  state(prop, dto) {
    if (prop.Required === false && (dto === null || dto === undefined || dto.length===0))
      return true
    if (prop.Required === true && prop.Type === 'enum' && prop.PropEnums.find( ({value}) => value === dto) === undefined)
      return false
    if (prop.Required === true && (dto === null || dto === undefined || dto.length===0))
      return false;
    if (prop.Type === 'number') {
      if ((prop.Max !== null && (dto === null ||  dto === undefined || dto > prop.Max)) || 
        (prop.Min !== null && (dto === null ||  dto === undefined || dto < prop.Min))) {
        return false
      }
      if(isNaN(dto)) {
        return false
      }
    }
    if (prop.Type === 'text') {
      if ((prop.MaxLength !== null && (dto === null ||   dto === undefined || dto.length > prop.MaxLength!)) || 
        (prop.MinLength !== null && (dto === null ||   dto === undefined || dto.length < prop.MinLength!))) {
        return false
      }
    }
    return true
  },
  isValidState(dto) {
    if (!this.schema)
        return true;
    return this.schema.Props.filter( ({ Hidden }) => { return !Hidden }).every(prop => this.state(prop, dto[prop.Name!])===true)
  },
  isNumeric(prop) {
    return (prop.Type === 'number')
  }
}
export default schemaTool