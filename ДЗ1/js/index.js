let store = window.localStorage; 
console.log(store);

const refreshCatsAndContent = () => {
	const content = document.getElementsByClassName('content')[0];
	content.innerHTML = '';

	api.getAllCats().then((res) => {
		store.setItem('cats', JSON.stringify(res)); 
		const cards = res.reduce((acc, el) => (acc += generateCard(el)), '');
		content.insertAdjacentHTML('afterbegin', cards); 

		let cards2 = document.getElementsByClassName('card');
		for (let i = 0, cnt = cards2.length; i < cnt; i++) {
			const width = cards2[i].offsetWidth;
			cards2[i].style.height = width * 0.6 + 'px';
		}
	});
};

const openCatCardPopup = (cat) => {
	const content = document.getElementsByClassName('content')[0];
	content.insertAdjacentHTML('afterbegin', generateCatCardPopup(cat));

	let catPopup = document.querySelector('.popup-wrapper-cat-card');
	let closeCatPopup = document.querySelector('.popup-close-cat-card');
	console.log(closeCatPopup);
	closeCatPopup.addEventListener('click', () => {
		catPopup.remove();
	});
};

const refreshCatsAndContentSync = () => {
	const content = document.getElementsByClassName('content')[0];
	content.innerHTML = '';

	const cards = JSON.parse(store.getItem('cats')).reduce(
		(acc, el) => (acc += generateCard(el)),
		''
	);
	content.insertAdjacentHTML('afterbegin', cards); 

	let cards2 = document.getElementsByClassName('card');
	for (let i = 0, cnt = cards2.length; i < cnt; i++) {
		const width = cards2[i].offsetWidth;
		cards2[i].style.height = width * 0.6 + 'px';
	}
};

const addCatInLocalStorage = (cat) => {
	store.setItem(
		'cats',
		JSON.stringify([...JSON.parse(store.getItem('cats')), cat])
	);
};

const deleteCatFromLocalStorage = (catId) => {
	store.setItem(
		'cats',
		JSON.stringify(
			JSON.parse(store.getItem('cats')).filter((el) => el.id != catId) 
		)
	);
};

const getNewIdOfCatSync = () => {
	let res = JSON.parse(store.getItem('cats')); 
	if (res.length) {
		return Math.max(...res.map((el) => el.id)) + 1;
	} else {
		return 1;
	}
};


const getNewIdOfCat = () => {
	return api.getIdsOfCat().then((res) => {
		if (res.length) {
			return Math.max(...res) + 1;
		} else {
			return 1;
		}
	});
};

refreshCatsAndContent();

document
	.getElementsByClassName('content')[0]
	.addEventListener('click', (event) => {
		if (event.target.tagName === 'BUTTON') {
			switch(event.target.className) {
				case 'cat-card-view':
					api.getCatById(event.target.value).then((res) => {
							openCatCardPopup(res);
						});					
					break;
					case 'cat-card-update':
						api.getCatById(event.target.value).then((res) => {
							for(let i = 0; i < document.forms[0].elements.length; i++) {
								document.forms[0].elements[i].value = Object.values(res)[i];
							}
							popupForm.classList.add('active');
							popupForm.parentElement.classList.add('active');
							store.setItem('btnClassInd', 'updateCat');
							store.setItem('catId', event.target.value);
						});
					break;
					case 'cat-card-delete':
						api.deleteCat(event.target.value).then((res) => {
							deleteCatFromLocalStorage(event.target.value);
							refreshCatsAndContentSync();
						});
					break;
				}
		}
	});


document.forms[0].addEventListener('submit', (event) => {
	event.preventDefault();
	const formData = new FormData(event.target);
	const body = Object.fromEntries(formData.entries());
	switch(store.getItem('btnClassInd')) {
		case 'addCat':
			api.addCat({ ...body, id: getNewIdOfCatSync() }).then(() => {
				addCatInLocalStorage({ ...body, id: getNewIdOfCatSync() }); 
				refreshCatsAndContentSync();
			});
			break;
		case 'updateCat':
			api.updateCat({ ...body, id: store.getItem('catId') }).then(() => {
				refreshCatsAndContentSync();
			});
			break;
	}
});

document
	.getElementById('reload-page')
	.addEventListener('click', refreshCatsAndContent);

let addBtn = document.querySelector('#add');
let popupForm = document.querySelector('#popup-form');
let closePopupForm = popupForm.querySelector('.popup-close');

addBtn.addEventListener('click', (e) => {
	e.preventDefault();
	if (!popupForm.classList.contains('active')) {
		popupForm.classList.add('active');
		popupForm.parentElement.classList.add('active');
		store.setItem('btnClassInd', 'addCat');
	}
});

closePopupForm.addEventListener('click', () => {
	popupForm.classList.remove('active');
	popupForm.parentElement.classList.remove('active');
});
