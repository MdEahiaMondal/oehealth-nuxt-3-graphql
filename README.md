## Deployment
### Ansible
#### macOS
- Install `ansible` using [Homebrew](https://brew.sh/)
```
brew install ansible
```
- Install required ansible rules
```
ansible-galaxy install -r ./ansible/requirements.yml
```
- Deploy the latest changes in production server
```
ansible-playbook -i ./ansible/hosts ./ansible/prod.yml -u egap
```
- Deploy the latest changes in dev server
```
ansible-playbook -i ./ansible/hosts ./ansible/dev.yml -u ogap
```
