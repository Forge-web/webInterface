import { getTableConfig } from "drizzle-orm/pg-core";

export interface ForeignKeyMeta {
	tableName: string;
	columnName: string;
	referencedTableName: string;
	referencedColumnName: string;
}

export default function getTableConfigByName(
	tableName: string,
): ForeignKeyMeta[] {
	const result: ForeignKeyMeta[] = [];

	const value = Object.values(getTableByString(tableName));
	// Пропускаем всё, что не является таблицей Drizzle
	try {
		const config = getTableConfig(value[0].table as any);

		for (const fk of config.foreignKeys) {
			// ⚠️ reference содержит ОБЪЕКТЫ — берём только имена
			const reference = (fk as any).reference?.() ?? fk;

			const localCols: any[] = reference.columns ?? [];
			const foreignCols: any[] = reference.foreignColumns ?? [];
			const foreignTable = reference.foreignTable;

			// getTableConfig от PgTable возвращает { name, ... } — забираем только name
			const referencedTableName =
				typeof foreignTable === "string"
					? foreignTable
					: getTableConfig(foreignTable).name;

			// Поддерживаем только простые (не составные) FK — типичный случай
			if (localCols.length === 1 && foreignCols.length === 1) {
				result.push({
					tableName: config.name, // ← строка
					columnName: localCols[0].name, // ← строка
					referencedTableName, // ← строка
					referencedColumnName: foreignCols[0].name, // ← строка
				});
			}
		}
	} catch {
		// не таблица — пропускаем
	}

	return result;
}
