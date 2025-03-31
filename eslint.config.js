import protectMeFromMyStupidity            from 'eslint-config-protect-me-from-my-stupidity';
import andFromWritingStupidWebApplications from 'eslint-config-protect-me-from-my-stupidity/and/from-writing-stupid-web-applications';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - -

export default [
	{
		ignores : [
			'ko-co.js',
			'ko-co.cjs'
		]
	},
	...protectMeFromMyStupidity(),
	...andFromWritingStupidWebApplications()
];
