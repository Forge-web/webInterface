<script setup lang="ts">
    import * as schema from '../../../drizzle/schema'; 

    const route = useRoute();
    const rawTableName = route.params.table as string;

    // Функция для преобразования snake_case в camelCase
    function toCamelCase(str: string): string {
    return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
    }

    // Преобразуем имя из URL (payment_types) в имя из схемы (paymentTypes)
    const tableName = toCamelCase(rawTableName);

    // Берем таблицу из схемы по имени
    const table = computed(() => (schema as any)[tableName]);

    // Извлекаем поля и фильтруем служебные
    const fields = computed(() => {
    if (!table.value) return [];
    
    return Object.entries(table.value)
        .filter(([key, column]: [string, any]) => {
        if (key === 'id' || key === 'createdAt' || key === 'updateAt') return false;
        if (column.hasDefault) return false;
        if (column.generated) return false;
        return true;
        })
        .map(([key, column]: [string, any]) => ({
        name: key,
        label: column.name || key,
        type: mapDataType(column.dataType),
        required: column.notNull,
        }));
    });

    // Маппинг типа Drizzle в HTML-тип
    function mapDataType(dataType: string): string {
    switch (dataType) {
        case 'number': return 'number';
        case 'string': return 'text';
        case 'date': return 'datetime-local';
        case 'boolean': return 'checkbox';
        default: return 'text';
    }
    }

    const formData = ref<Record<string, any>>({});

    watch(fields, (newFields) => {
    newFields.forEach(field => {
        if (formData.value[field.name] === undefined) {
        formData.value[field.name] = '';
        }
    });
    }, { immediate: true });

    const handleSubmit = () => {
    console.log('Отправка:', formData.value);
    alert('Данные отправлены! (заглушка)');
    };
</script>

<template>
    <NuxtLink to="/tables" class="font-bold hover:text-gray-600 transition-colors">
       < Назад
    </NuxtLink>


  <div class="p-5 max-w-2xl mx-auto">
   
    <h1 class="text-xl font-bold uppercase mb-4">Таблица: {{ tableName }}</h1>

    <form v-if="fields.length" @submit.prevent="handleSubmit" class="flex flex-col gap-4">
      <div v-for="field in fields" :key="field.name" class="flex flex-col">
        <label class="text-xs font-bold uppercase text-gray-600 mb-1">
          {{ field.label }} <span v-if="field.required" class="text-red-500">*</span>
        </label>
        <input 
          v-model="formData[field.name]"
          :type="field.type"
          :required="field.required"
          class="border border-gray-400 p-2 rounded focus:outline-none focus:border-black"
        />
      </div>

      <button type="submit" class="bg-black text-white p-2 font-bold uppercase tracking-wider hover:bg-gray-800 transition-colors">
        Сохранить
      </button>
    </form>

    <p v-else class="text-gray-500">Таблица «{{ tableName }}» не найдена.</p>
  </div>
</template>