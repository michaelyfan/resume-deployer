
const uploadAll = (resume, config) => {
  const formData = new FormData();
  formData.append('files', resume, resume.name);
  Object.entries(config).forEach(([key, value]) => {
    formData.append(key, value);
  });

  const options = {
    method: 'POST',
    body: formData
  };
  return fetch('/api/runAll', options).then((res) => {
    return res.body;
  });
};

export {
  uploadAll
};
