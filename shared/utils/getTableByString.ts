import * as schemas from "schemas-pg";
export default (nameTable: string) => {
	return schemas[nameTable as keyof typeof schemas];
};
