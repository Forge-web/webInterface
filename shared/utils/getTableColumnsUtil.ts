import { getTableColumns } from "drizzle-orm";
import * as schemas from "schemas-pg";
import type { byTable, getFromTable } from "../interfaces/byTable";

// 1. Получаем объект со всеми колонками таблицы

export const getTableColumnsUtil: getFromTable = (table) => {
	const columns = getTableColumns(table);

	// 2. Преобразуем в удобный список с именами и типами
	const columnsMeta = Object.entries(columns).map(
		([fieldName, columnObj]) => {
			return {
				field: fieldName, // Имя свойства в TypeScript (например, userId)
				dbName: columnObj.name, // Имя колонки в самой БД (например, user_id)
				drizzleType: columnObj.dataType, // Базовый тип Drizzle (string, number, boolean, buffer и т.д.)
				columnType: columnObj.columnType, // Конкретный тип SQL (serial, varchar, timestamp и т.д.)
				isNullable: !columnObj.notNull, // Может ли быть null
				hasDefault: columnObj.hasDefault, // Есть ли значение по умолчанию
			};
		},
	);
	return columnsMeta;
};

/* Вывод будет похож на:
[
  { field: 'id', dbName: 'id', drizzleType: 'number', columnType: 'serial', ... },
  { field: 'name', dbName: 'full_name', drizzleType: 'string', columnType: 'varchar', ... }
]
*/
