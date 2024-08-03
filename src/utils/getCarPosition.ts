const getCarPositon = (car: HTMLDivElement) => {
	if (!car.parentElement) {
		return 0;
	}
	const parentRect = car.parentElement.getBoundingClientRect();
	const carRect = car.getBoundingClientRect();
	return carRect.left - parentRect.left - 1;
};

export default getCarPositon;
