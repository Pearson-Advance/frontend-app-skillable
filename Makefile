transifex_resource = frontend-app-skillable
transifex_langs = "ar,fr,es_419,zh_CN"

tx_url1 = https://www.transifex.com/api/2/project/edx-platform/resource/$(transifex_resource)/translation/en/strings/
tx_url2 = https://www.transifex.com/api/2/project/edx-platform/resource/$(transifex_resource)/source/

# This directory must match .babelrc .
transifex_temp = ./temp/babel-plugin-react-intl

precommit:
	npm run lint
	npm audit

requirements:
	npm install

extract_translations: | requirements

# Despite the name, we actually need this target to detect changes in the incoming translated message files as well.
detect_changed_source_translations:
	# Checking for changed translations...

# Pushes translations to Transifex.  You must run make extract_translations first.
push_translations:
	# Pushing strings to Transifex...
	tx push -s
	# Fetching hashes from Transifex...
	./node_modules/reactifex/bash_scripts/get_hashed_strings.sh $(tx_url1)
	# Writing out comments to file...
	$(transifex_utils) $(transifex_temp) --comments
	# Pushing comments to Transifex...
	./node_modules/reactifex/bash_scripts/put_comments.sh $(tx_url2)

# Pulls translations from Transifex.
pull_translations:
	tx pull -f --mode reviewed --languages=$(transifex_langs)

# This target is used by Travis.
validate-no-uncommitted-package-lock-changes:
	# Checking for package-lock.json changes...
	git diff --exit-code package-lock.json
