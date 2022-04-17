module.exports = {
    run: function () {

        var tower = Game.getObjectById('625b3c81cd5ecd38f45e2250');

        //搜索敌人
        const enemys = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        const needToRepairs = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => {
                return (
                    structure.hits < structure.hitsMax
                )
            }
        });

        //根据敌人位置攻击敌人
        if (enemys) {
            tower.attack(enemys);
        } else if (needToRepairs) {
            tower.repair(needToRepairs);
        }

    }
}