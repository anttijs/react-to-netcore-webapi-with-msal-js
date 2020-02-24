
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

export class SchemaTool  {
  schema:  Schema
  constructor(schema: Schema) {
    this.schema = schema
  }
  editFields() {
    if (!this.schema)
        return []
    return this.schema.Props.filter( ({ Hidden }) => { return !Hidden })
  }
  label(prop: Prop) {
    if (prop.Type === 'bool')
      return ''
    else if (prop.Title === null || prop.Title==="")
      return prop.Name!
    else
      return prop.Title
  }
  labelForCheckBox(prop: Prop) {
    if (prop.Type !== 'bool')
      return ''
    if (prop.Title === null)
      return prop.Name!
    return prop.Title
  }
  invalidFeedback(prop: Prop, dto: any): string {
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
  }
  state(prop: Prop, dto: any): boolean {
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
  }
  isValidState(dto: any): boolean {
    if (!this.schema)
        return true;
    return this.schema.Props.filter( ({ Hidden }) => { return !Hidden }).every(prop => this.state(prop, dto[prop.Name!])===true)
  }
  isNumeric(prop: Prop) {
    return (prop.Type === 'number')
  }
  strToValue(prop: Prop, valuestr: string): any {
    if (this.isNumeric(prop)) {
      return Number(valuestr)
    }
    if (prop.Type === 'enum') {
      return Number(valuestr)
    }
    return valuestr

  }
}