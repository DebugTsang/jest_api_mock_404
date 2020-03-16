function UserManager(){
  this.users = [{name: 'apple'}];
}

UserManager.prototype.getAll = function(){
  return this.users;
};

UserManager.prototype.create = function( userSet){
	if (typeof userSet.name === 'string') {
		this.users.push(userSet);
		return true;
	}
	return false;
};

module.exports = UserManager;