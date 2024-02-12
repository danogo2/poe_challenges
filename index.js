// ==UserScript==
// @name         PoE Challenges
// @namespace    http://tampermonkey.net/
// @version      2024-01-31
// @description  try to take over the world!
// @author       You
// @match        https://poedb.tw/us/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=poedb.tw
// @grant        GM_addStyle
// @run-at       document-end
// ==/UserScript==

(function () {
  'use strict';
  GM_addStyle(`
  /* change default styles */
input.card-query {
  margin: 0;
}

/* settings header */
.tablesorter-header {
  display: none;
}
.settings {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 1%;
  padding: 0 1% 10px 1%;
}

.settings-option {
  display: flex;
  align-items: center;
}

.settings-option:hover {
  filter: brightness(0.8);
}

.hidden,
input[type='checkbox'].hidden {
  /* Add if not using autoprefixer */
  -webkit-appearance: none;
  appearance: none;
  /* For iOS < 15 to remove gradient background */
  background-color: transparent;
  /* Not removed via appearance */
  margin: 0;
  padding: 0;
}

.settings-icon {
  width: 32px;
  height: 32px;
  cursor: pointer;
}

.icon-show {
  display: none;
}

.hide-completed .completed,
.hide-completed .icon-hide {
  display: none;
}

.hide-completed .icon-show {
  display: block;
}

#tags {
  width: 150px;
  text-align: center;
  padding: 4px;
}

.tag-option {
  /* only color and background color can be styled via css for select's option, the rest is OS-dependent */
  width: 150px;
}

/* challenge element */
td a {
  margin-right: 10px;
}

input[type='checkbox'] {
  -webkit-transform: scale(1);
}
.text-start > li {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  padding-left: 0;
}

input[type='checkbox'].task-check {
  align-self: center;
  margin-right: 10px;
}
input[type='checkbox'].task-check:checked {
  accent-color: #202020;
  outline: 1px solid #777;
}
.task-check:hover {
  cursor: pointer;
}
li:has(.task-check:checked) .task-text {
  text-decoration: line-through solid #777;
  color: #777;
}
.completed a {
  text-decoration: line-through solid #fafafa;
}

.input-note,
.input-tag {
  background-color: transparent;
  border: none;
  color: #afafaf;
  cursor: pointer;
  padding: 0 0.4rem 0 0.4rem;
  flex-grow: 1;
  font-family: Verdana, Geneva, Tahoma, sans-serif;
  font-size: 0.8rem;
  border-radius: 4px;
  text-decoration: none;
}
.input-note:focus,
.input-note:hover,
.input-tag:focus,
.input-tag:hover {
  outline: solid 1px #989898;
}

.input-note {
  margin-left: 10px;
}

.tag-hidden {
  display: none;
}
`);

  const svgIconEye =
    '<svg xmlns="http://www.w3.org/2000/svg" class="ionicon" viewBox="0 0 512 512"><circle cx="256" cy="256" r="64" fill="#fafafa"/><path fill="#fafafa" d="M490.84 238.6c-26.46-40.92-60.79-75.68-99.27-100.53C349 110.55 302 96 255.66 96c-42.52 0-84.33 12.15-124.27 36.11-40.73 24.43-77.63 60.12-109.68 106.07a31.92 31.92 0 00-.64 35.54c26.41 41.33 60.4 76.14 98.28 100.65C162 402 207.9 416 255.66 416c46.71 0 93.81-14.43 136.2-41.72 38.46-24.77 72.72-59.66 99.08-100.92a32.2 32.2 0 00-.1-34.76zM256 352a96 96 0 1196-96 96.11 96.11 0 01-96 96z"/></svg>';

  const svgIconEyeOff =
    '<svg xmlns="http://www.w3.org/2000/svg" class="ionicon" viewBox="0 0 512 512"><path d="M432 448a15.92 15.92 0 01-11.31-4.69l-352-352a16 16 0 0122.62-22.62l352 352A16 16 0 01432 448zM248 315.85l-51.79-51.79a2 2 0 00-3.39 1.69 64.11 64.11 0 0053.49 53.49 2 2 0 001.69-3.39zM264 196.15L315.87 248a2 2 0 003.4-1.69 64.13 64.13 0 00-53.55-53.55 2 2 0 00-1.72 3.39z" fill="#fafafa"/><path d="M491 273.36a32.2 32.2 0 00-.1-34.76c-26.46-40.92-60.79-75.68-99.27-100.53C349 110.55 302 96 255.68 96a226.54 226.54 0 00-71.82 11.79 4 4 0 00-1.56 6.63l47.24 47.24a4 4 0 003.82 1.05 96 96 0 01116 116 4 4 0 001.05 3.81l67.95 68a4 4 0 005.4.24 343.81 343.81 0 0067.24-77.4zM256 352a96 96 0 01-93.3-118.63 4 4 0 00-1.05-3.81l-66.84-66.87a4 4 0 00-5.41-.23c-24.39 20.81-47 46.13-67.67 75.72a31.92 31.92 0 00-.64 35.54c26.41 41.33 60.39 76.14 98.28 100.65C162.06 402 207.92 416 255.68 416a238.22 238.22 0 0072.64-11.55 4 4 0 001.61-6.64l-47.47-47.46a4 4 0 00-3.81-1.05A96 96 0 01256 352z" fill="#fafafa"/></svg>';

  const svgIconTrash =
    '<svg xmlns="http://www.w3.org/2000/svg" class="ionicon" viewBox="0 0 512 512"><path d="M296 64h-80a7.91 7.91 0 00-8 8v24h96V72a7.91 7.91 0 00-8-8z" fill="none"/><path d="M432 96h-96V72a40 40 0 00-40-40h-80a40 40 0 00-40 40v24H80a16 16 0 000 32h17l19 304.92c1.42 26.85 22 47.08 48 47.08h184c26.13 0 46.3-19.78 48-47l19-305h17a16 16 0 000-32zM192.57 416H192a16 16 0 01-16-15.43l-8-224a16 16 0 1132-1.14l8 224A16 16 0 01192.57 416zM272 400a16 16 0 01-32 0V176a16 16 0 0132 0zm32-304h-96V72a7.91 7.91 0 018-8h80a7.91 7.91 0 018 8zm32 304.57A16 16 0 01320 416h-.58A16 16 0 01304 399.43l8-224a16 16 0 1132 1.14z" fill="#fafafa"/></svg>';

  let challsMap = new Map(); // {challengeIndex/ID: {quantity: 1,tasks: [{isComplete:false, note=''}, {isComplete:false, note=''}]}
  const challElements = new Map();
  let challsGotLoaded = false;
  let league, clearIconEl, selectTagEl;
  let lastSelectedTagValue = '';

  const allTagsSet = new Set();

  const getChallsFromLS = () => {
    return JSON.parse(localStorage.getItem(league));
  };

  const updateLS = () => {
    localStorage.setItem(league, JSON.stringify(Array.from(challsMap)));
  };

  const formatTask = taskEl => {
    taskEl.innerHTML = `<span class="task-text">${taskEl.textContent}</span>`;
  };

  // taskEl is li element
  const insertCheckboxEl = taskEl => {
    taskEl.insertAdjacentHTML(
      'afterbegin',
      '<input type="checkbox" class="task-check" />'
    );
    return taskEl.querySelector(':first-child');
  };

  const insertNoteEl = taskEl => {
    taskEl.insertAdjacentHTML(
      'beforeend',
      ' <input type="text" class="input-note" placeholder="...">'
    );
    return taskEl.querySelector(':last-child');
  };

  const isChallengeComplete = chall => {
    return chall.completed >= chall.quantity;
  };

  const insertTagInputEl = (headerEl, id, challObj) => {
    headerEl.insertAdjacentHTML(
      'beforeend',
      `<input type="text" class="input-tag" placeholder="tag1, tag2, tag3.." data-id="${id}"/>`
    );
    const curChalTags = challObj.tags;
    if (curChalTags.length === 0) return;
    for (let tag of curChalTags) {
      allTagsSet.add(tag);
    }
    const tagsString = curChalTags.join(', ');
    headerEl.querySelector('.input-tag').value = tagsString;
  };

  // using this method because {element.innerHTML = ''}doesn't clear event handlers of the child nodes and might cause memory leak
  const removeAllChildNodes = parent => {
    while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
    }
  };

  const resetTagsSet = () => {
    allTagsSet.clear();
    for (let challObj of challsMap.values()) {
      for (let tag of challObj.tags) {
        allTagsSet.add(tag);
      }
    }
  };

  const updateTagsDropdownHTML = () => {
    // has to run after changing tag inputs
    const selectEl = document.querySelector('#tags');
    removeAllChildNodes(selectEl);
    resetTagsSet();
    selectEl.insertAdjacentHTML(
      'afterbegin',
      '<option class="tag-option" value="">--Choose a tag--</option>'
    );
    for (let tag of allTagsSet.values()) {
      selectEl.insertAdjacentHTML(
        'beforeend',
        `<option class="tag-option" value="${tag}">${tag}</option>`
      );
    }

    let selectedTagIndex;

    if (!allTagsSet.has(lastSelectedTagValue)) {
      // none chall has currently selected tag
      selectEl.selectedIndex = 0;
      for (let challEl of challElements.values()) {
        challEl.classList.remove('tag-hidden');
      }
      lastSelectedTagValue = '';
    } else {
      let i = 0;
      for (let option of selectEl.options) {
        if (option.value === lastSelectedTagValue) {
          selectedTagIndex = i;
        }
        i++;
      }
    }

    selectEl.selectedIndex = selectedTagIndex;
    updateLS();
  };

  const formatChallenge = challEl => {
    const id = challEl.querySelector(':first-child').textContent; // starting from 1, 2, 3...
    const singleTask = challEl.querySelector('.text-start div');
    let subTasks = challEl.querySelectorAll('li');
    const header = challEl.querySelector('td:nth-child(2) div');

    // if there is only 1 task/no subtasks
    if (subTasks.length < 1) {
      subTasks = [singleTask];
    }
    if (!challsGotLoaded) {
      //first run, create challs Map
      const quantity = Number(
        challEl.querySelector('span.text-type0').textContent
      );
      let tasks = Array.from({ length: subTasks.length }, () => ({
        isComplete: false,
        note: '',
      })); // or new Array and fill with foor loop, avoid fill method when filling with objects because it only gives reference to <th></th>e first object
      challsMap.set(id, {
        quantity: subTasks.length === 1 ? 1 : quantity,
        tasks,
        completed: 0,
        tags: [],
      });
    }
    const challObj = challsMap.get(id);
    insertTagInputEl(header, id, challObj);
    for (let i = 0; i < subTasks.length; i++) {
      const taskEl = subTasks[i];
      formatTask(taskEl);
      taskEl.setAttribute('data-id', `${id}-${i}`);
      const addedCheckboxEl = insertCheckboxEl(taskEl);
      const taskIsComplete = challObj.tasks[i].isComplete;
      addedCheckboxEl.checked = taskIsComplete;
      const addedNoteEl = insertNoteEl(taskEl);
      addedNoteEl.value = challObj.tasks[i].note;
    }
    if (isChallengeComplete(challObj)) {
      challEl.classList.add('completed');
    } else {
      challEl.classList.remove('completed');
    }
  };

  const clearChallsHandler = event => {
    const hasConfirmed = confirm(
      `Clear challenges for ${league.split('_')[0]} league?`
    );
    if (hasConfirmed) {
      localStorage.removeItem(league);
      location.reload();
    }
  };

  const selectTagHandler = event => {
    const selectedTagValue = event.target.value;
    const selectedTagIndex = event.target.selectedIndex;
    lastSelectedTagValue = selectedTagValue;
    // hide challenges without selected tag
    for (let [id, challObj] of challsMap.entries()) {
      const curChallEl = challElements.get(id);
      if (
        selectedTagIndex !== 0 &&
        challObj.tags.indexOf(selectedTagValue) === -1
      ) {
        curChallEl.classList.add('tag-hidden');
      } else {
        // show chall if default value is selected('') or has selected tag
        curChallEl.classList.remove('tag-hidden');
      }
    }
  };

  window.onload = event => {
    league = window.location.pathname
      .split('/')
      .at(-1)
      .replace(/#(?<=#)\w+/g, '');
    const settingsNav = document.querySelector('.tab-content .card.mb-2 div');
    settingsNav.classList.add('settings');
    settingsNav.insertAdjacentHTML(
      'afterbegin',
      '<div class="settings-option"><select name="tags" id="tags"><option class="tag-option" value="">--Choose a tag--</option></select></div>'
    );
    settingsNav.insertAdjacentHTML(
      'afterbegin',
      `<div class="settings-option"><input type="checkbox" id="hide-completed" class="hide-completed hidden"/><label class="label-checkbox" for="hide-completed"><div class="settings-icon icon-hide" title="hide completed">${svgIconEye}</div><div class="settings-icon icon-show" title="show completed">${svgIconEyeOff}</div></label></div>`
    );
    settingsNav.insertAdjacentHTML(
      'beforeend',
      `<div class="settings-option"><div class="settings-icon icon-clear" title="clear challenges">${svgIconTrash}</div></div>`
    );
    const loadedChalls = getChallsFromLS(league);
    if (loadedChalls !== null) {
      challsMap = new Map(loadedChalls);
      challsGotLoaded = true;
    }
    const challs = document.querySelectorAll('tr:has(.explicitMod)');
    // formatting all challenges, populating challenges map
    for (let i = 0; i < challs.length; i++) {
      const challEl = challs[i];
      challElements.set(`${i + 1}`, challEl);
      formatChallenge(challEl);
    }
    // update dropdown menu
    if (challsGotLoaded) updateTagsDropdownHTML();
    // single element event handlers
    clearIconEl = document.querySelector('.icon-clear');
    clearIconEl.addEventListener('click', event => {
      clearChallsHandler(event);
    });
    selectTagEl = document.querySelector('#tags');
    selectTagEl.addEventListener('change', event => {
      selectTagHandler(event);
    });
  };

  const checkboxClickHandler = checkboxEl => {
    const taskEl = checkboxEl.parentElement; // li or div (for signle task)
    const id = taskEl.dataset.id; // task id = "challengeIndex-taskNumber"
    const challId = id.match(/\d+(?=-)/)[0];
    const taskIndex = id.match(/(?<=-)\d+/)[0];
    const isComplete = checkboxEl.checked;
    const chall = challsMap.get(challId);
    if (isComplete) {
      chall.completed++; // completed tasks counter
    } else {
      chall.completed--;
    }
    chall.tasks[taskIndex].isComplete = isComplete;
    if (isChallengeComplete(chall)) {
      challElements.get(challId).classList.add('completed');
    } else {
      challElements.get(challId).classList.remove('completed');
    }
    updateLS();
  };

  const noteChangeHandler = noteEl => {
    const taskEl = noteEl.parentElement;
    const id = taskEl.dataset.id; //'challId-noteIndex'
    const challId = id.match(/\d+(?=-)/)[0];
    const taskIndex = id.match(/(?<=-)\d+/)[0];
    const chall = challsMap.get(challId);
    chall.tasks[taskIndex].note = noteEl.value;
    updateLS();
  };

  const tagInputHandler = tagInputEl => {
    const inputValue = tagInputEl.value;
    let enteredTags = inputValue.length ? inputValue.match(/[^\s,]+/g) : [];
    // create Set from array to get rid of duplicates
    const curChallTagsSet = new Set(enteredTags);
    enteredTags = [...curChallTagsSet];
    // tag max length: 16 characters
    const formattedTags = enteredTags.map(tag => tag.slice(0, 16));

    const challId = tagInputEl.dataset.id; // 'challId'
    const challObj = challsMap.get(challId);
    challObj.tags = [];
    for (let tag of formattedTags) {
      challObj.tags.push(tag);
    }
    tagInputEl.value = formattedTags.join(', ');

    updateTagsDropdownHTML();
    // hide challenge after deleting currently selected tag from its tag input
    if (
      lastSelectedTagValue !== '' &&
      !curChallTagsSet.has(lastSelectedTagValue)
    ) {
      challElements.get(challId).classList.add('tag-hidden');
    }
    updateLS();
  };

  document.addEventListener('change', function (event) {
    // event delegation
    const target = event.target;
    if (target.classList.contains('task-check')) {
      checkboxClickHandler(target);
    }

    if (target.classList.contains('hide-completed')) {
      if (target.checked) {
        document
          .querySelector('.tab-content .card.mb-2')
          .classList.add('hide-completed');
      } else {
        document
          .querySelector('.tab-content .card.mb-2')
          .classList.remove('hide-completed');
      }
    }

    if (target.className === 'input-note') {
      noteChangeHandler(target);
    }

    if (target.className === 'input-tag') {
      tagInputHandler(target);
    }
  });
})();
