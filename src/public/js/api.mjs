document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('fetch-data').addEventListener('click', fetchTestData);
  document.getElementById('add-document').addEventListener('click', () => addTestDocument({ name: 'Новий тестовий документ' }));
  document.getElementById('update-document').addEventListener('click', () => updateTestDocument('document_id', { name: 'Оновлений тестовий документ' }));
  document.getElementById('delete-document').addEventListener('click', () => deleteTestDocument('document_id'));
})

// Функція для отримання даних з колекції test
export async function fetchTestData() {
  try {
    const response = await fetch('/api/test');
    const data = await response.json();
    console.log('Test data:', data);
  } catch (error) {
    console.error('Помилка при отриманні даних:', error);
  }
}

// Функція для додавання документа в колекцію test
export async function addTestDocument(document) {
  try {
    const response = await fetch('/api/test', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(document)
    });
    const result = await response.json();
    console.log('Документ додано:', result);
  } catch (error) {
    console.error('Помилка при додаванні документа:', error);
  }
}

// Функція для оновлення документа в колекції test
export async function updateTestDocument(id, updates) {
  try {
    const response = await fetch(`/api/test/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updates)
    });
    const result = await response.json();
    console.log('Документ оновлено:', result);
  } catch (error) {
    console.error('Помилка при оновленні документа:', error);
  }
}

// Функція для видалення документа з колекції test
export async function deleteTestDocument(id) {
  try {
    const response = await fetch(`/api/test/${id}`, {
      method: 'DELETE' 
    });
    const result = await response.json();
    console.log('Документ видалено:', result);
  } catch (error) {
    console.error('Помилка при видаленні документа:', error);
  }
}

