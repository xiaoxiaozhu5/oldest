(([_, repo]) => {
  const branchElement = document.querySelector("#branch-select-menu > summary > span.css-truncate-target");
  const branch = branchElement ? branchElement.textContent : 'master';
  fetch(`https://github.com/${repo}/tree/${branch}`)
    .then(res => res.text())
    .then(res => {
      const mainDocument = new DOMParser().parseFromString(res, 'text/html');
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
    const url = `https://github.com/${repo}/commits/${branch}?after=${commitId}+${commitCount-10}`;
      window.location = url;
  })
})(window.location.pathname.match(/\/([^\/]+\/[^\/]+)(?:\/(?:tree|commits|blob)\/([^\/]+))?/));
