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
	{
		files : [
			'tests/**/*.test.js'
		],

		languageOptions :
		{
			globals : {
				'before'     : 'readonly',
				'after'      : 'readonly',
				'afterEach'  : 'readonly',
				'beforeEach' : 'readonly',
				'describe'   : 'readonly',
				'it'         : 'readonly'
			}
		}
	},
	...protectMeFromMyStupidity(),
	...andFromWritingStupidWebApplications()
];
