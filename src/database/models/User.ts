import {
    Table,
    Column,
    Model,
    PrimaryKey,
    AllowNull,
    Unique,
    HasOne,
    HasMany
} from 'sequelize-typescript';

import {
    DataTypes,
} from "sequelize";

@Table({
    timestamps: true,
    freezeTableName: true,
    tableName: "user",
    underscored: true,
    modelName: "User",
    paranoid: true,
})
export default class User extends Model {
    @PrimaryKey
    @AllowNull(false)
    @Column({
        type: DataTypes.BIGINT,
        autoIncrement: true,
    })
    id: number;

    @AllowNull(false)
    @Unique(true)
    @Column({
        type: DataTypes.STRING(256)
    })
    email: string;

    @AllowNull(false)
    @Column({
        type: DataTypes.STRING(256),
    })
    password: string;

}
