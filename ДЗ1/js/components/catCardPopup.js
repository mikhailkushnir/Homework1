const generateCatCardPopup = (cat) => {
	return `<div class="popup-wrapper-cat-card active">
        <div class="popup-cat-card active">
        <div class="popup-close-cat-card btn"><i class="fa-solid fa-xmark"></i></div>
            <div class="${
							cat.favourite ? 'card like' : 'card'
						}" style="background-image: url(${
		cat.img_link || 'images/cat.jpg'
	})">
            <div><h3>Имя: </h3>${cat.name}</div>
            <div><h3>Описание: </h3>${cat.description}</div>
            <div><h3>Возраст: </h3>${cat.age}</div>
            <div><h3>Оценка: </h3>${cat.rate}</div>
        </div>
    </div>`;
};
