module.exports = {
    run: function (creep) {
        //搜索敌人
        const enemys = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);

        //根据敌人位置攻击敌人
        if (enemys) {
            if (creep.attack(enemys) == ERR_NOT_IN_RANGE) {
                creep.moveTo(enemys);
            }
        }
    }
}