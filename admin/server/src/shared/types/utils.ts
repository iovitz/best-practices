type Primitive = string | number | symbol;

// 将对象的某些属性设定为可选
export type PickProps<
  ObjectType extends Record<Primitive, unknown>,
  RequiredPropKeys extends keyof ObjectType = '',
  PartialPropKeys extends keyof ObjectType = '',
> = Partial<Pick<ObjectType, PartialPropKeys>> &
  Pick<ObjectType, RequiredPropKeys>;
