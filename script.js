const treeParts = document.querySelectorAll(".tree-part");
const dropZones = document.querySelectorAll(".drop-zone");
const title = document.querySelector(".title");
const reload = document.querySelector(".reload");
const treeBack = document.querySelector(".treeBack");

let draggedElement = null; // Элемент, который перетаскивают
let offsetX = 0; // Смещение по X относительно курсора
let offsetY = 0; // Смещение по Y относительно курсора

window.addEventListener("mousewheel", function (e) {
  if (e.ctrlKey) {
    e.preventDefault();
    return false;
  }
});
document.addEventListener(
  "touchstart",
  (e) => {
    // Если используется более одного пальца
    if (e.touches.length > 1) {
      e.preventDefault(); // Отключаем действие по умолчанию
    }
  },
  { passive: false }
); // { passive: false } важно для предотвращения поведения по умолчанию
document.addEventListener(
  "touchmove",
  (e) => {
    if (e.touches.length > 1) {
      e.preventDefault(); // Отключаем зумирование двумя пальцами
    }
  },
  { passive: false }
); // { passive: false } важно для отмены действия по умолчанию

reload.addEventListener("click", () => {
  location.reload();
});

// Инициализация событий для каждой части ёлки
treeParts.forEach((part) => {
  part.addEventListener("mousedown", startDrag);
  part.addEventListener("touchstart", startTouchDrag, { passive: false });

  // Запрещаем стандартное перетаскивание браузером
  part.addEventListener("dragstart", (event) => event.preventDefault());

  // Устанавливаем атрибут draggable в false
  part.setAttribute("draggable", "false");
});

document.addEventListener("mousemove", drag);
document.addEventListener("touchmove", touchDrag, { passive: false });
document.addEventListener("mouseup", endDrag);
document.addEventListener("touchend", endTouchDrag);

function startDrag(event) {
  draggedElement = event.target;

  // Вычисляем смещение между курсором и верхним левым углом элемента
  const rect = draggedElement.getBoundingClientRect();
  offsetX = event.clientX - rect.left;
  offsetY = event.clientY - rect.top;

  // Устанавливаем абсолютное позиционирование для элемента
  draggedElement.style.position = "absolute";
}

function drag(event) {
  if (!draggedElement) return;

  // Обновляем позицию элемента на основе координат курсора
  draggedElement.style.left = `${event.clientX - offsetX}px`;
  draggedElement.style.top = `${event.clientY - 900}px`;
}

function endDrag(event) {
  if (!draggedElement) return;

  const dropZone = getDropZoneUnderCursor(event.clientX, event.clientY);

  if (dropZone && dropZone.dataset.part === draggedElement.dataset.part) {
    dropZone.appendChild(draggedElement);
    draggedElement.style.position = "static"; // Возвращаем стандартное позиционирование

    // Запрещаем дальнейшее перетаскивание элемента
    draggedElement.removeEventListener("mousedown", startDrag);
    draggedElement.removeEventListener("touchstart", startTouchDrag);
    draggedElement.setAttribute("draggable", "false");

    checkWin();
  } else {
    // Если зона не подходит, возвращаем элемент на место
    resetDraggedElement();
    title.textContent = "Часть не подходит для этой зоны.";
    setTimeout(() => {
      title.textContent = "Собери новогоднюю ёлку!";
    }, 2000);
  }

  draggedElement = null; // Сбрасываем текущий перетаскиваемый элемент
}

function startTouchDrag(event) {
  event.preventDefault(); // Отключаем стандартное поведение браузера
  const touch = event.touches[0];
  draggedElement = event.target;

  const rect = draggedElement.getBoundingClientRect();
  offsetX = touch.clientX - rect.left;
  offsetY = touch.clientY - rect.top;

  draggedElement.style.position = "absolute";
}

function touchDrag(event) {
  if (!draggedElement) return;

  const touch = event.touches[0];
  draggedElement.style.left = `${touch.clientX - offsetX}px`;
  draggedElement.style.top = `${touch.clientY - 900}px`;
}

function endTouchDrag(event) {
  if (!draggedElement) return;

  const touch = event.changedTouches[0];
  const dropZone = getDropZoneUnderCursor(touch.clientX, touch.clientY);

  if (dropZone && dropZone.dataset.part === draggedElement.dataset.part) {
    dropZone.appendChild(draggedElement);
    draggedElement.style.position = "static";

    // Запрещаем дальнейшее перетаскивание элемента
    draggedElement.removeEventListener("mousedown", startDrag);
    draggedElement.removeEventListener("touchstart", startTouchDrag);
    draggedElement.setAttribute("draggable", "false");

    checkWin();
  } else {
    resetDraggedElement();
    title.textContent = "Часть не подходит для этой зоны.";
    setTimeout(() => {
      title.textContent = "Собери новогоднюю ёлку!";
    }, 2000);
  }

  draggedElement = null;
}

// Возвращает зону, над которой находится курсор или палец
function getDropZoneUnderCursor(x, y) {
  const elementUnderCursor = document.elementFromPoint(x, y);
  return elementUnderCursor?.closest(".drop-zone");
}

// Сбрасывает позицию перетаскиваемого элемента
function resetDraggedElement() {
  draggedElement.style.position = "static";
}

// Проверка, все ли части ёлки на своих местах
function checkWin() {
  const completed = document.querySelectorAll(".drop-zone img").length;

  if (completed === treeParts.length) {
    title.textContent = "Поздравляем! Вы собрали ёлку!";
    treeBack.remove();
  }
}
