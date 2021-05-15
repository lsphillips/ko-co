export default function performKeyPress (key, element = document)
{
	element.dispatchEvent(
		new KeyboardEvent('keydown', {
			key
		})
	);

	element.dispatchEvent(
		new KeyboardEvent('keyup', {
			key
		})
	);
}
