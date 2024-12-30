OLDEST
====
A bookmarklet to quickly get you to the oldest commit page of a repo.

### Overview

Being able to quickly navigate to the oldest commit page in a repo is quite helpful. Go ahead and drag the [bookmarklet (link)](http://bpceee.github.io/oldest/) onto your bookmark bar and click it whenever you'd like to go to the first commit page of a repo.

### Direct use
```js
(function () {
    const branchButton = document.getElementById('branch-picker-commits');
    const ariaLabel = branchButton.getAttribute('aria-label');
    const branchName = ariaLabel.split(' ')[0];
    (([_, repo, branch = branchName]) => {
        fetch(`https://github.com/${repo}/tree/${branch}`).then(res => res.text()).then(res => {
            let mainDocument = new DOMParser().parseFromString(res, 'text/html');
			const tmpScripts = mainDocument.getElementsByTagName("script");
			let commitCount = 0;
			let commitId = '';
			for (let i = 0; i < tmpScripts.length; i++) {
				if (tmpScripts[i].hasAttribute('type')) {
					if (tmpScripts[i].getAttribute('type') == 'application/json') {
						let json = JSON.parse(tmpScripts[i].innerHTML, (key, value) => {
							if (key == 'commitCount') {
								commitCount = Number(value.trim().replaceAll(',', ''));
							}
							if (key == 'currentOid') {
								commitId = value;
							}
						})
					}
				}
			}
			console.log(commitCount)
			console.log(commitId)
            let url = `https://github.com/${repo}/commits/${branch}?after=${commitId}+${commitCount-10}`;
            window.location = url;
        })
    })(window.location.pathname.match(/\/([^\/]+\/[^\/]+)(?:\/(?:tree|commits|blob)\/([^\/]+))?/))
})()
```
copy to console and run

### Credits
* Inspired by [INIT](https://github.com/FarhadG/init). However there is a limitation on api.github.com calls, so this bookmarklet parses the main page to get the commitID and count.

* Use https://mrcoles.com/bookmarklet/ as a bookmarklet creator
